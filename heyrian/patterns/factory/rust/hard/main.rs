// Edit PreparedNotice, prepare and dispatch. Input handling and earlier helpers are below.

use std::collections::HashMap;
use std::io::Read;

#[derive(Clone)]
struct ClientRequest {
    tenant: String,
    provider: String,
    sender: Option<String>,
    endpoint: Option<String>,
    timeout_ms: Option<i32>,
}

#[derive(Clone)]
struct ClientPolicy {
    prefix: String,
    timeout_ms: i32,
}

#[derive(Clone)]
enum NotificationClient {
    Relay {
        tenant: String,
        address: String,
        timeout_ms: i32,
    },
    Webhook {
        tenant: String,
        address: String,
        timeout_ms: i32,
    },
}

impl NotificationClient {
    // Test double: a receipt, no network I/O.
    fn send(&self, payload: &str) -> String {
        match self {
            Self::Relay {
                tenant,
                address,
                timeout_ms,
            } => format!("{}|relay|{}|{}|{}", tenant, address, timeout_ms, payload),
            Self::Webhook {
                tenant,
                address,
                timeout_ms,
            } => format!("{}|webhook|{}|{}|{}", tenant, address, timeout_ms, payload),
        }
    }
}

fn make_client(
    request: &ClientRequest,
    policy: &ClientPolicy,
) -> Result<NotificationClient, String> {
    if request.tenant.trim().is_empty() {
        return Err("tenant is required".into());
    }
    let timeout_ms = request.timeout_ms.unwrap_or(policy.timeout_ms);
    if timeout_ms <= 0 {
        return Err("timeout must be positive".into());
    }
    if request.provider == "relay" {
        let sender = request
            .sender
            .clone()
            .unwrap_or_else(|| format!("{}/{}", policy.prefix, request.tenant));
        if sender.trim().is_empty() || (request.sender.is_none() && policy.prefix.trim().is_empty())
        {
            return Err("sender is required".into());
        }
        return Ok(NotificationClient::Relay {
            tenant: request.tenant.clone(),
            address: sender,
            timeout_ms,
        });
    }
    if request.provider == "webhook" {
        let endpoint = request.endpoint.as_deref().unwrap_or("");
        if !endpoint.starts_with("https://") || endpoint.len() <= 8 {
            return Err("https endpoint is required".into());
        }
        return Ok(NotificationClient::Webhook {
            tenant: request.tenant.clone(),
            address: endpoint.into(),
            timeout_ms,
        });
    }
    Err("unsupported provider".into())
}

fn api_client(tenant: &str, policy: &ClientPolicy) -> Result<NotificationClient, String> {
    make_client(
        &ClientRequest {
            tenant: tenant.into(),
            provider: "relay".into(),
            sender: None,
            endpoint: None,
            timeout_ms: None,
        },
        policy,
    )
}

fn scheduled_client(tenant: &str, policy: &ClientPolicy) -> Result<NotificationClient, String> {
    make_client(
        &ClientRequest {
            tenant: tenant.into(),
            provider: "relay".into(),
            sender: None,
            endpoint: None,
            timeout_ms: Some(4000),
        },
        policy,
    )
}

fn resend_client(tenant: &str, policy: &ClientPolicy) -> Result<NotificationClient, String> {
    make_client(
        &ClientRequest {
            tenant: tenant.into(),
            provider: "relay".into(),
            sender: Some(format!("support/{}", tenant)),
            endpoint: None,
            timeout_ms: None,
        },
        policy,
    )
}

struct PreparedNotice {
    client: Result<NotificationClient, String>,
    message: String,
}

fn prepare(request: &ClientRequest, policy: &ClientPolicy, message: &str) -> PreparedNotice {
    // TODO: meet the queued-notice receipt requirements.

    PreparedNotice {
        client: make_client(request, policy),
        message: message.to_owned(),
    }
}

fn dispatch(notice: &PreparedNotice, _policy: &ClientPolicy) -> String {
    // TODO: meet the dispatch receipt requirements.

    match &notice.client {
        Ok(client) => client.send(&notice.message),
        Err(_) => "rejected".to_owned(),
    }
}

// Supplied transport; all custom request, policy and prepared types are in this file.
fn optional_text(word: &str) -> Option<String> {
    match word {
        "-" => None,
        "~" => Some(String::new()),
        _ => Some(word.to_owned()),
    }
}

fn main() {
    let mut input = String::new();
    std::io::stdin().read_to_string(&mut input).unwrap();
    let mut policies: HashMap<String, ClientPolicy> = HashMap::new();
    let missing = ClientPolicy {
        prefix: String::new(),
        timeout_ms: 0,
    };
    let mut draft = ClientRequest {
        tenant: String::new(),
        provider: "relay".to_owned(),
        sender: None,
        endpoint: None,
        timeout_ms: None,
    };
    let mut pending: Vec<(String, PreparedNotice)> = Vec::new();

    let mut held: Result<NotificationClient, String> = Err("no product".to_owned());

    for line in input.lines() {
        let words: Vec<&str> = line.split_whitespace().collect();
        if words.is_empty() {
            continue;
        }

        match words[0] {
            "P" => {
                policies.insert(
                    words[1].to_owned(),
                    ClientPolicy {
                        prefix: if words[2] == "~" {
                            String::new()
                        } else {
                            words[2].to_owned()
                        },
                        timeout_ms: words[3].parse().unwrap(),
                    },
                );
            }
            "R" => {
                draft = ClientRequest {
                    tenant: if words[1] == "~" {
                        String::new()
                    } else {
                        words[1].to_owned()
                    },
                    provider: words[2].to_owned(),
                    sender: optional_text(words[3]),
                    endpoint: optional_text(words[4]),
                    timeout_ms: if words[5] == "-" {
                        None
                    } else {
                        Some(words[5].parse().unwrap())
                    },
                };
            }
            "B" => {
                held = make_client(&draft, policies.get(&draft.tenant).unwrap_or(&missing));
            }
            "U" => {
                let output = match &held {
                    Ok(client) => client.send(&words[1..].join(" ")),
                    Err(_) => "rejected".to_owned(),
                };
                println!("{output}");
            }
            "A" | "S" => {
                let (client, offset) = if words[0] == "S" {
                    (
                        make_client(&draft, policies.get(&draft.tenant).unwrap_or(&missing)),
                        1,
                    )
                } else {
                    let policy = policies.get(words[2]).unwrap_or(&missing);
                    let client = match words[1] {
                        "api" => api_client(words[2], policy),
                        "scheduled" => scheduled_client(words[2], policy),
                        _ => resend_client(words[2], policy),
                    };
                    (client, 3)
                };
                let output = match client {
                    Ok(client) => client.send(&words[offset..].join(" ")),
                    Err(_) => "rejected".to_owned(),
                };
                println!("{output}");
            }
            "Q" => {
                let policy = policies.get(&draft.tenant).unwrap_or(&missing);
                pending.push((
                    draft.tenant.clone(),
                    prepare(&draft, policy, &words[1..].join(" ")),
                ));
            }
            "F" => {
                for (tenant, notice) in pending.drain(..) {
                    println!(
                        "{}",
                        dispatch(&notice, policies.get(&tenant).unwrap_or(&missing))
                    );
                }
            }
            _ => {}
        }
    }
}
