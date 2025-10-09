import { Outlet } from "react-router-dom";
import {use, useEffect} from "react";
import { useUserStore } from "../store/userStore";

export default function TenantGuard() {
    const { tenantId, loadTenantData} = useUserStore();

    useEffect(() => {
        if(tenantId) {
            const idFromUrl = new URLSearchParams(window.location.search).get("tenant");
            if(idFromUrl) loadTenantData(idFromUrl);
        }}, [tenantId]);

    return <Outlet />;
}