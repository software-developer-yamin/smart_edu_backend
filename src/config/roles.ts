const allRoles = {
  user: ['getUsers', 'manageUsers', 'getPayments', 'managePayments'],
  admin: ['getUsers', 'manageUsers', 'getPayments', 'managePayments'],
};

export const roles: string[] = Object.keys(allRoles);
export const roleRights: Map<string, string[]> = new Map(Object.entries(allRoles));
