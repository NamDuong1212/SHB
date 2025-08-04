import http from "./http";

export default class CollectionService {
    static api = "v1/organizations/64cd3380-3cba-4cfb-9770-c3c60936b463/collections";
    static async getAll(params) { 
        const queryString = params.toString();
        const finalUrl = `${this.api}?${queryString}`;
        return http.get(finalUrl);
    }

    static async delete(id) {
        return http.delete(`${this.api}/${id}`);
    }
    
    // static async getByUser(params = {}) {
    //     const defaultParams = {
    //         page: 1,
    //         page_size: 100,
    //         ...params 
    //     };
    //     return http.get(`${this.api}`, { params: defaultParams });
    // }

    static async create(data) {
        return await http.post(`${this.api}`, data);
    }
    
    static async getDocumentsByCollection(id) {
        return await http.get(`/doc/collection/${id}`);
    }
}