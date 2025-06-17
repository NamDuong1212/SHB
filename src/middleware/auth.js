import { useAuthStore } from "@/stores/useAuth";

export default function initAuth({ next, router }) {
    const auth = useAuthStore();
    auth.loadFromStorage();
    if (!auth.isLoggedIn) {
        return router.push({ name: 'login' });
    }

    return next();
}
