# User Related Queries
ALL_USERS_WITH_SPENT = """
    SELECT 
        u.user_id as id, 
        CONCAT(u.first_name, ' ', u.last_name) as name, 
        u.email, 
        u.status::text as status,
        COALESCE(SUM(o.total_price), 0) as total_spent
    FROM users u
    LEFT JOIN orders o ON u.user_id = o.user_id
    WHERE u.deleted_at IS NULL
    GROUP BY u.user_id, u.first_name, u.last_name, u.email, u.status
    ORDER BY total_spent DESC
"""

TOTAL_USERS_COUNT = "SELECT COUNT(*) as count FROM users WHERE deleted_at IS NULL"
ACTIVE_USERS_COUNT = "SELECT COUNT(*) as count FROM users WHERE status = 'active'"
