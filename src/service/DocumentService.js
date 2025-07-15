import http from "./http";

export default class DocumentService {
    // Static API endpoints
    static api = "doc/";

    static async delete(id) {
        return http.delete(`${this.api}/${id}`);
    }

}