"use client";
import { useAuth } from "../context/AuthContext";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";
import { ROLES } from "../../utils/constants";

export default function ProtectedRoute({ children, allowedRoles = [] }) {
  const { user, loading, isAuthenticated, getDashboardPath } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading) {
      if (!isAuthenticated) {
        router.push("/login?redirect=" + pathname);
      } else if (allowedRoles.length > 0) {
        const roleId = Number(user?.id_role);
        const isAllowed = allowedRoles.some(role => {
          const targetRoleId = ROLES[role.toUpperCase()];
          return roleId === targetRoleId;
        });

        if (!isAllowed) {
          router.push(getDashboardPath());
        }
      }
    }
  }, [isAuthenticated, loading, user, allowedRoles, router, pathname, getDashboardPath]);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: 'var(--gray-50)' }}>
        <div className="spinner"></div>
        <style jsx>{`
          .spinner {
            width: 40px;
            height: 40px;
            border: 4px solid var(--gray-200);
            border-top-color: var(--teal-primary);
            border-radius: 50%;
            animation: spin 0.8s linear infinite;
          }
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  if (!isAuthenticated) return null;

  if (allowedRoles.length > 0) {
    const roleId = Number(user?.id_role);
    const isAllowed = allowedRoles.some(role => ROLES[role.toUpperCase()] === roleId);
    if (!isAllowed) return null;
  }

  return children;
}
