# Report Related Queries
TREND_MONTHLY = """
    SELECT 
        TO_CHAR(d, 'YYYY-MM-DD') as full_date,
        TO_CHAR(d, 'Mon YY') as name,
        COALESCE(SUM(o.total_price), 0) as revenue,
        COUNT(DISTINCT o.order_id) as orders,
        (SELECT COUNT(*) FROM users u WHERE DATE_TRUNC('month', u.created_at) = DATE_TRUNC('month', d)) as users
    FROM generate_series(
        DATE_TRUNC('year', NOW()) - INTERVAL '2 years',
        DATE_TRUNC('year', NOW()) + INTERVAL '1 year',
        INTERVAL '1 month'
    ) d
    LEFT JOIN orders o ON DATE_TRUNC('month', o.order_date) = d AND o.order_status::text != 'cancelled'
    GROUP BY d
    ORDER BY d
"""

TREND_YEARLY = """
    SELECT 
        TO_CHAR(d, 'YYYY-MM-DD') as full_date,
        TO_CHAR(d, 'YYYY') as name,
        COALESCE(SUM(o.total_price), 0) as revenue,
        COUNT(DISTINCT o.order_id) as orders,
        (SELECT COUNT(*) FROM users u WHERE DATE_TRUNC('year', u.created_at) = DATE_TRUNC('year', d)) as users
    FROM generate_series(
        DATE_TRUNC('year', NOW()) - INTERVAL '5 years',
        DATE_TRUNC('year', NOW()),
        INTERVAL '1 year'
    ) d
    LEFT JOIN orders o ON DATE_TRUNC('year', o.order_date) = d AND o.order_status::text != 'cancelled'
    GROUP BY d
    ORDER BY d
"""

TREND_DAILY = """
    SELECT 
        TO_CHAR(d, 'YYYY-MM-DD') as full_date,
        TO_CHAR(d, 'DD Mon') as name,
        COALESCE(SUM(o.total_price), 0) as revenue,
        COUNT(DISTINCT o.order_id) as orders,
        (SELECT COUNT(*) FROM users u WHERE DATE_TRUNC('day', u.created_at) = DATE_TRUNC('day', d)) as users
    FROM generate_series(
        DATE_TRUNC('day', NOW()) - INTERVAL '60 days',
        DATE_TRUNC('day', NOW()),
        INTERVAL '1 day'
    ) d
    LEFT JOIN orders o ON DATE_TRUNC('day', o.order_date) = d AND o.order_status::text != 'cancelled'
    GROUP BY d
    ORDER BY d
"""

GLOBAL_REVENUE = "SELECT COALESCE(SUM(total_price), 0) as total FROM orders WHERE order_status::text != 'cancelled'"
TOTAL_ORDERS = "SELECT COUNT(*) as count FROM orders"
TOTAL_USERS = "SELECT COUNT(*) as count FROM users"
LOW_STOCK_COUNT = "SELECT COUNT(*) as count FROM product_variants WHERE stock_qty < 10"

INVENTORY_STATUS = """
    SELECT 
        c.category_name as name,
        COUNT(pv.variant_id) as total,
        COUNT(CASE WHEN pv.stock_qty < 5 THEN 1 END) as short,
        COUNT(CASE WHEN pv.stock_qty >= 5 AND pv.stock_qty < 15 THEN 1 END) as low
    FROM categories c
    LEFT JOIN products p ON c.category_id = p.category_id
    LEFT JOIN product_variants pv ON p.product_id = pv.product_id
    GROUP BY c.category_id, c.category_name
    ORDER BY total DESC
    LIMIT 8
"""

TOP_PERFORMING_PRODUCTS = """
    SELECT 
        p.product_name as name,
        c.category_name as category,
        pv.price,
        COALESCE(SUM(oi.quantity * oi.unit_price), 0) as total_revenue,
        COUNT(DISTINCT o.user_id) as users
    FROM products p
    JOIN product_variants pv ON p.product_id = pv.product_id
    JOIN categories c ON p.category_id = c.category_id
    LEFT JOIN order_items oi ON pv.variant_id = oi.variant_id
    LEFT JOIN orders o ON oi.order_id = o.order_id
    GROUP BY p.product_id, p.product_name, c.category_name, pv.price
    ORDER BY total_revenue DESC
    LIMIT 50
"""

FULFILMENT_DATA = """
    SELECT 
        EXTRACT(DAY FROM d)::integer as day,
        COUNT(CASE WHEN DATE_TRUNC('month', o.order_date) = DATE_TRUNC('month', NOW()) AND o.order_status::text != 'cancelled' THEN o.order_id END) as this_month,
        COUNT(CASE WHEN DATE_TRUNC('month', o.order_date) = DATE_TRUNC('month', NOW() - INTERVAL '1 month') AND o.order_status::text != 'cancelled' THEN o.order_id END) as last_month
    FROM generate_series(
        DATE_TRUNC('month', NOW()),
        DATE_TRUNC('month', NOW()) + INTERVAL '1 month' - INTERVAL '1 day',
        INTERVAL '1 day'
    ) d
    LEFT JOIN orders o ON EXTRACT(DAY FROM o.order_date) = EXTRACT(DAY FROM d)
        AND o.order_date >= DATE_TRUNC('month', NOW() - INTERVAL '1 month')
    GROUP BY EXTRACT(DAY FROM d)
    ORDER BY day
"""

LEVEL_DATA = """
    SELECT 
        c.category_name as name,
        COUNT(DISTINCT o.order_id) as volume,
        COUNT(DISTINCT r.review_id) * 5 as service
    FROM categories c
    LEFT JOIN products p ON c.category_id = p.category_id
    LEFT JOIN product_variants pv ON p.product_id = pv.product_id
    LEFT JOIN order_items oi ON pv.variant_id = oi.variant_id
    LEFT JOIN orders o ON oi.order_id = o.order_id
    LEFT JOIN reviews r ON p.product_id = r.product_id AND r.rating >= 4
    GROUP BY c.category_id, c.category_name
    ORDER BY volume DESC
    LIMIT 5
"""
