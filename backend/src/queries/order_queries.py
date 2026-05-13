# Order Related Queries
ALL_ORDERS = """
    SELECT 
        order_id as id, 
        shipping_name as customer, 
        order_date as date, 
        total_price as amount, 
        order_status::text as status
    FROM orders
    ORDER BY order_date DESC
    LIMIT 100
"""

ORDER_ITEMS_BY_IDS = """
    SELECT 
        oi.order_id, 
        oi.product_name, 
        oi.quantity, 
        oi.unit_price
    FROM order_items oi
    WHERE oi.order_id IN %s
"""

ORDER_STATS_PENDING = "SELECT COUNT(*) as count FROM orders WHERE order_status::text = 'pending'"
ORDER_STATS_SHIPPED = "SELECT COUNT(*) as count FROM orders WHERE order_status::text IN ('shipped', 'delivered')"
ORDER_STATS_CANCELLED = "SELECT COUNT(*) as count FROM orders WHERE order_status::text = 'cancelled'"

TOTAL_ORDERS_COUNT = "SELECT COUNT(*) as count FROM orders"
