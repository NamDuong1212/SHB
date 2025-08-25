const BASE_URL = 'http://115.84.183.240:6868'

class WorkflowService {

    static async getWorkflow() {
        try {
            const response = await fetch(`${BASE_URL}/api/v1/workflows/wf_unlock_card`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            })

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`)
            }

            return await response.json()
        } catch (error) {
            console.error('Error getting workflow:', error)
            throw error
        }
    }


    static async createWorkflow() {
        try {
            const response = await fetch(`${BASE_URL}/api/v1/workflows/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
            })

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`)
            }

            return await response.json()
        } catch (error) {
            console.error('Error creating workflow:', error)
            throw error
        }
    }


    static async deleteWorkflow() {
        try {
            const response = await fetch(`${BASE_URL}/api/v1/workflows/wf_unlock_card`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                }
            })

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`)
            }

            return response.status === 204 ? { success: true } : await response.json()
        } catch (error) {
            console.error('Error deleting workflow:', error)
            throw error
        }
    }


    static async getNodeDetail(nodeId) {
        try {
            const response = await fetch(`${BASE_URL}/api/v1/nodes/${nodeId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            })

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`)
            }

            return await response.json()
        } catch (error) {
            console.error(`Error getting node detail for ${nodeId}:`, error)
            throw error
        }
    }


    static async updateNodeBody(nodeId, bodyData) {
        try {
            const response = await fetch(`${BASE_URL}/api/v1/nodes/wf_unlock_card/${nodeId}/body`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(bodyData)
            })

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`)
            }

            return response.status === 204 ? { success: true } : await response.json()
        } catch (error) {
            console.error(`Error updating node body for ${nodeId}:`, error)
            throw error
        }
    }
}

export default WorkflowService
