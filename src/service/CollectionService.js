import http from "./http";

export default class CollectionService {
    // Static API endpoints
    static api = "collection";

    static async getAll(params = {}) {
        return http.get(`${this.api}`, { params });
    }

    static async delete(name) {
        return http.delete(`${this.api}/${name}`);
    }

    static async create(data) {
        return await http.post(`${this.api}`, data);
    }
}