import http from "./http";

export default class DocumentService {
    // Static API endpoints
    static api = "v1/documents";

    static async delete(id) {
        return http.delete(`${this.api}/${id}`);
    }

}