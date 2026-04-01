import { consola } from 'consola'

const logger = consola.withTag('agent')

let agentSocket: WebSocket | null = null
let reconnectTimer: ReturnType<typeof setTimeout> | null = null
const pendingRequests = new Map<string, (response: any) => void>()

function generateId(): string {
  return Math.random().toString(36).slice(2)
}

function connect() {
  const url = 'ws://localhost:8765'

  agentSocket = new WebSocket(url)

  agentSocket.onopen = () => {
    logger.info('Connected to beat-clerk agent')
    if (reconnectTimer) {
      clearTimeout(reconnectTimer)
      reconnectTimer = null
    }
  }

  agentSocket.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data)
      const requestId = data.requestId

      if (requestId && pendingRequests.has(requestId)) {
        const resolve = pendingRequests.get(requestId)!
        pendingRequests.delete(requestId)
        resolve(data)
      }
    } catch (e) {
      logger.error('Failed to parse agent message:', e)
    }
  }

  agentSocket.onclose = () => {
    logger.warn('Agent disconnected, reconnecting in 5s...')
    agentSocket = null
    reconnectTimer = setTimeout(connect, 5000)
  }

  agentSocket.onerror = (e) => {
    logger.error('Agent WebSocket error:', e)
  }
}

export function sendToAgent(type: string, payload?: any): Promise<any> {
  return new Promise((resolve, reject) => {
    if (!agentSocket || agentSocket.readyState !== WebSocket.OPEN) {
      return reject(new Error('Agent is not connected'))
    }

    const requestId = generateId()
    const message = { type, payload, requestId }

    pendingRequests.set(requestId, resolve)

    setTimeout(() => {
      if (pendingRequests.has(requestId)) {
        pendingRequests.delete(requestId)
        reject(new Error('Agent request timed out'))
      }
    }, 10000)

    agentSocket.send(JSON.stringify(message))
  })
}

export function isAgentConnected(): boolean {
  return agentSocket !== null && agentSocket.readyState === WebSocket.OPEN
}

export default defineNitroPlugin(() => {
  connect()
})
