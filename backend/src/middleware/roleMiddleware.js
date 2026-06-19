const checkRole = (role) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ error: 'Unauthorized: No user information found.' });
        }

        if (req.user.role !== role) {
            return res.status(403).json({ error: `Forbidden: Requires ${role} privileges.` });
        }

        next();
    };
};

const requireAdmin = checkRole('admin');
const requireDevOps = checkRole('devops');
const requireDeveloper = checkRole('dev');

module.exports = {
    requireAdmin,
    requireDevOps,
    requireDeveloper
};
