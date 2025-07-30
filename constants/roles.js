export const ROLES = {
    SUPERADMIN: 1,
    ADMIN: 2,
    USER: 3,
};

export const ROLESGROUP = {
    AdminRole: [ROLES.SUPERADMIN],
    AdminsRole: [ROLES.SUPERADMIN, ROLES.ADMIN],
    CommonRoler: [ROLES.SUPERADMIN, ROLES.ADMIN, ROLES.USER],
};
