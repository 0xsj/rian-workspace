// Edit PreparedNotice, prepare and dispatch. Input handling and earlier helpers are below.

import { createInterface } from 'node:readline';
import { stdin, stdout } from 'node:process';

type ClientRequest = {
	tenant: string;
	provider: string;
	sender?: string;
	endpoint?: string;
	timeoutMs?: number;
};

type ClientPolicy = { prefix: string; timeoutMs: number };

interface NotificationClient {
	send(payload: string): string;
}

class RelayClient implements NotificationClient {
	readonly tenant: string;
	readonly address: string;
	readonly timeoutMs: number;

	constructor(tenant: string, address: string, timeoutMs: number) {
		this.tenant = tenant;
		this.address = address;
		this.timeoutMs = timeoutMs;
		Object.freeze(this);
	}

	// Test double: a receipt, no network I/O.
	send(payload: string): string {
		return [this.tenant, 'relay', this.address, this.timeoutMs, payload].join('|');
	}
}

function makeClient(request: ClientRequest, policy: ClientPolicy): NotificationClient {
	if (!request.tenant.trim()) throw new Error('tenant is required');
	const timeoutMs = request.timeoutMs ?? policy.timeoutMs;
	if (timeoutMs <= 0) throw new Error('timeout must be positive');
	if (request.provider === 'relay') {
		const sender = request.sender ?? policy.prefix + '/' + request.tenant;
		if (!sender.trim() || (request.sender === undefined && !policy.prefix.trim()))
			throw new Error('sender is required');
		return new RelayClient(request.tenant, sender, timeoutMs);
	}
	if (request.provider === 'webhook') {
		const endpoint = request.endpoint ?? '';
		if (!endpoint.startsWith('https://') || endpoint.length <= 8)
			throw new Error('https endpoint is required');
		const tenant = request.tenant;
		return {
			send(payload: string): string {
				return [tenant, 'webhook', endpoint, timeoutMs, payload].join('|');
			}
		};
	}

	throw new Error('unsupported provider');
}

// Supplied caller adapters.
function apiClient(tenant: string, policy: ClientPolicy): NotificationClient {
	return makeClient({ tenant, provider: 'relay' }, policy);
}

function scheduledClient(tenant: string, policy: ClientPolicy): NotificationClient {
	return makeClient({ tenant, provider: 'relay', timeoutMs: 4000 }, policy);
}

function resendClient(tenant: string, policy: ClientPolicy): NotificationClient {
	return makeClient({ tenant, provider: 'relay', sender: 'support/' + tenant }, policy);
}

type PreparedNotice = { client?: NotificationClient; message: string };

function prepare(request: ClientRequest, policy: ClientPolicy, message: string): PreparedNotice {
	// TODO: meet the queued-notice receipt requirements.

	try {
		return { client: makeClient(request, policy), message };
	} catch {
		return { message };
	}
}

function dispatch(notice: PreparedNotice, _policy: ClientPolicy): string {
	// TODO: meet the dispatch receipt requirements.

	return notice.client?.send(notice.message) ?? 'rejected';
}

// Supplied transport: P/R edit policy/draft; A/S send; B/U hold/use a client. Q/F queue/flush.
function optionalText(value: string): string | undefined {
	return value === '-' ? undefined : value === '~' ? '' : value;
}

async function main() {
	const policies = new Map<string, ClientPolicy>();
	const policy = (tenant: string): ClientPolicy =>
		policies.get(tenant) ?? { prefix: '', timeoutMs: 0 };
	const draft: ClientRequest = { tenant: '', provider: 'relay' };
	const pending: { tenant: string; notice: PreparedNotice }[] = [];
	let held: NotificationClient | undefined;
	const lines = createInterface({ input: stdin, crlfDelay: Infinity });

	for await (const line of lines) {
		const words = line.trim().split(/\s+/);
		const command = words[0];

		if (command === 'P') {
			policies.set(words[1], {
				prefix: words[2] === '~' ? '' : words[2],
				timeoutMs: Number(words[3])
			});
		} else if (command === 'R') {
			Object.assign(draft, {
				tenant: words[1] === '~' ? '' : words[1],
				provider: words[2],
				sender: optionalText(words[3]),
				endpoint: optionalText(words[4]),
				timeoutMs: words[5] === '-' ? undefined : Number(words[5])
			});
		} else if (command === 'B') {
			try {
				held = makeClient(draft, policy(draft.tenant));
			} catch {
				held = undefined;
			}
		} else if (command === 'U') {
			stdout.write((held?.send(words.slice(1).join(' ')) ?? 'rejected') + '\n');
		} else if (command === 'A' || command === 'S') {
			try {
				const client =
					command === 'S'
						? makeClient(draft, policy(draft.tenant))
						: words[1] === 'api'
							? apiClient(words[2], policy(words[2]))
							: words[1] === 'scheduled'
								? scheduledClient(words[2], policy(words[2]))
								: resendClient(words[2], policy(words[2]));
				stdout.write(client.send(words.slice(command === 'S' ? 1 : 3).join(' ')) + '\n');
			} catch {
				stdout.write('rejected\n');
			}
		} else if (command === 'Q') {
			pending.push({
				tenant: draft.tenant,
				notice: prepare(draft, policy(draft.tenant), words.slice(1).join(' '))
			});
		} else if (command === 'F') {
			for (const item of pending.splice(0)) {
				stdout.write(dispatch(item.notice, policy(item.tenant)) + '\n');
			}
		}
	}
}

void main();
