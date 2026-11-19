// Inspect webhook creation and sending. The relay path, callers and transport are supplied.

package main

import (
	"bufio"
	"fmt"
	"os"
	"strconv"
	"strings"
)

type ClientRequest struct {
	Tenant, Provider string
	Sender, Endpoint *string
	TimeoutMS        *int
}

type ClientPolicy struct {
	Prefix    string
	TimeoutMS int
}

type NotificationClient interface{ Send(string) string }

type RelayClient struct {
	Tenant, Address string
	TimeoutMS       int
}

// Test double: a receipt, no network I/O.
func (c RelayClient) Send(payload string) string {
	return fmt.Sprintf("%s|relay|%s|%d|%s", c.Tenant, c.Address, c.TimeoutMS, payload)
}

type WebhookClient struct {
	Tenant    string
	Address   *string
	TimeoutMS int
}

func (c WebhookClient) Send(payload string) string {
	return fmt.Sprintf("%s|webhook|%s|%d|%s", c.Tenant, *c.Address, c.TimeoutMS, payload)
}

func MakeClient(request ClientRequest, policy ClientPolicy) (NotificationClient, error) {
	if strings.TrimSpace(request.Tenant) == "" {
		return nil, fmt.Errorf("tenant is required")
	}
	timeout := policy.TimeoutMS
	if request.TimeoutMS != nil {
		timeout = *request.TimeoutMS
	}
	if timeout <= 0 {
		return nil, fmt.Errorf("timeout must be positive")
	}
	sender := policy.Prefix + "/" + request.Tenant
	if request.Sender != nil {
		sender = *request.Sender
	}
	if strings.TrimSpace(sender) == "" || (request.Sender == nil && strings.TrimSpace(policy.Prefix) == "") {
		return nil, fmt.Errorf("sender is required")
	}
	if request.Provider == "relay" {
		return RelayClient{request.Tenant, sender, timeout}, nil
	}
	if request.Provider == "webhook" {
		if request.Endpoint == nil || !strings.HasPrefix(*request.Endpoint, "https://") || len(*request.Endpoint) <= 8 {
			return nil, fmt.Errorf("https endpoint is required")
		}
		return WebhookClient{request.Tenant, request.Endpoint, timeout}, nil
	}

	return nil, fmt.Errorf("unsupported provider")
}

func APIClient(tenant string, policy ClientPolicy) (NotificationClient, error) {
	return MakeClient(ClientRequest{Tenant: tenant, Provider: "relay"}, policy)
}

func ScheduledClient(tenant string, policy ClientPolicy) (NotificationClient, error) {
	timeout := 4000
	return MakeClient(ClientRequest{Tenant: tenant, Provider: "relay", TimeoutMS: &timeout}, policy)
}

func ResendClient(tenant string, policy ClientPolicy) (NotificationClient, error) {
	sender := "support/" + tenant
	return MakeClient(ClientRequest{Tenant: tenant, Provider: "relay", Sender: &sender}, policy)
}

// Supplied transport: '-' is absent and '~' is an explicitly empty field.
func setText(target **string, word string) {
	if word == "-" {
		*target = nil
		return
	}
	if *target == nil {
		*target = new(string)
	}
	if word == "~" {
		word = ""
	}
	**target = word
}

func main() {
	policies := map[string]ClientPolicy{}
	policy := func(tenant string) ClientPolicy { return policies[tenant] }
	draft := ClientRequest{}
	var held NotificationClient
	var heldErr error
	scanner := bufio.NewScanner(os.Stdin)

	for scanner.Scan() {
		words := strings.Fields(scanner.Text())
		if len(words) == 0 {
			continue
		}

		switch words[0] {
		case "P":
			prefix := words[2]
			if prefix == "~" {
				prefix = ""
			}
			timeout, _ := strconv.Atoi(words[3])
			policies[words[1]] = ClientPolicy{Prefix: prefix, TimeoutMS: timeout}
		case "R":
			draft.Tenant, draft.Provider = words[1], words[2]
			if draft.Tenant == "~" {
				draft.Tenant = ""
			}
			setText(&draft.Sender, words[3])
			setText(&draft.Endpoint, words[4])
			if words[5] == "-" {
				draft.TimeoutMS = nil
			} else {
				if draft.TimeoutMS == nil {
					draft.TimeoutMS = new(int)
				}
				*draft.TimeoutMS, _ = strconv.Atoi(words[5])
			}
		case "B":
			held, heldErr = MakeClient(draft, policy(draft.Tenant))
		case "U":
			if heldErr != nil || held == nil {
				fmt.Println("rejected")
			} else {
				fmt.Println(held.Send(strings.Join(words[1:], " ")))
			}
		case "A", "S":
			var client NotificationClient
			var err error
			offset := 1
			if words[0] == "S" {
				client, err = MakeClient(draft, policy(draft.Tenant))
			} else {
				offset = 3
				switch words[1] {
				case "api":
					client, err = APIClient(words[2], policy(words[2]))
				case "scheduled":
					client, err = ScheduledClient(words[2], policy(words[2]))
				default:
					client, err = ResendClient(words[2], policy(words[2]))
				}
			}
			if err != nil {
				fmt.Println("rejected")
			} else {
				fmt.Println(client.Send(strings.Join(words[offset:], " ")))
			}
		}
	}
}
