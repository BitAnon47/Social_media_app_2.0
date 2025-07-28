export const ROLES = {
    SUPERADMIN: 1,
    ADMIN: 2,
    USER: 3,
};

export const ROLESGROUP = {
    AdminRole: [ROLES.SUPERADMIN],                // Only superadmin
    AdminsRole: [ROLES.SUPERADMIN, ROLES.ADMIN],  // superadmin + admin
    CommonRoler: [ROLES.SUPERADMIN, ROLES.ADMIN, ROLES.USER] // All roles
};
