
import React, { useState, useEffect } from 'react';

// --- Constants & Configuration ---

const ROLES = {
  ADMIN: 'Admin',
  INVENTORY_MANAGER: 'Inventory Manager',
  WAREHOUSE_STAFF: 'Warehouse Staff',
  FINANCE_TEAM: 'Finance Team',
};

const STATUS_LABELS = {
  APPROVED: 'Approved',
  PENDING: 'Pending',
  REJECTED: 'Rejected',
  IN_PROGRESS: 'In Progress',
  SHIPPED: 'Shipped',
  DELIVERED: 'Delivered',
  CANCELLED: 'Cancelled',
  NEW: 'New',
  LOW_STOCK: 'Low Stock',
  OUT_OF_STOCK: 'Out of Stock',
  COMPLETED: 'Completed',
};

const MENU_ITEMS = [
  { id: 'DASHBOARD', label: 'Dashboard', icon: '📊', roles: [ROLES.ADMIN, ROLES.INVENTORY_MANAGER, ROLES.WAREHOUSE_STAFF, ROLES.FINANCE_TEAM] },
  { id: 'PRODUCTS', label: 'Products', icon: '📦', roles: [ROLES.ADMIN, ROLES.INVENTORY_MANAGER, ROLES.WAREHOUSE_STAFF] },
  { id: 'ORDERS', label: 'Orders', icon: '📝', roles: [ROLES.ADMIN, ROLES.INVENTORY_MANAGER, ROLES.FINANCE_TEAM] },
  { id: 'SHIPMENTS', label: 'Shipments', icon: '🚚', roles: [ROLES.ADMIN, ROLES.WAREHOUSE_STAFF, ROLES.INVENTORY_MANAGER] },
  { id: 'LOCATIONS', label: 'Locations', icon: '📍', roles: [ROLES.ADMIN, ROLES.WAREHOUSE_STAFF] },
  { id: 'USERS', label: 'Users', icon: '👤', roles: [ROLES.ADMIN] },
  { id: 'REPORTS', label: 'Reports', icon: '📈', roles: [ROLES.ADMIN, ROLES.FINANCE_TEAM, ROLES.INVENTORY_MANAGER] },
  { id: 'SETTINGS', label: 'Settings', icon: '⚙️', roles: [ROLES.ADMIN] },
];

// --- Dummy Data ---

const dummyProducts = [
  { id: 'PROD001', name: 'Wireless Mouse', sku: 'WM-001-BLK', category: 'Electronics', quantity: 150, unitPrice: 25.99, location: 'WH001-A1', status: 'APPROVED', minStock: 50, maxStock: 200, lastUpdated: '2023-10-26T10:00:00Z' },
  { id: 'PROD002', name: 'Mechanical Keyboard', sku: 'MK-RGB-BLUE', category: 'Electronics', quantity: 45, unitPrice: 79.99, location: 'WH001-A2', status: 'LOW_STOCK', minStock: 50, maxStock: 150, lastUpdated: '2023-10-26T11:00:00Z' },
  { id: 'PROD003', name: 'USB-C Hub', sku: 'USBC-HUB-7IN1', category: 'Accessories', quantity: 200, unitPrice: 39.99, location: 'WH002-B1', status: 'APPROVED', minStock: 100, maxStock: 300, lastUpdated: '2023-10-26T09:30:00Z' },
  { id: 'PROD004', name: 'Monitor Stand', sku: 'MS-ADJ-SIL', category: 'Furniture', quantity: 20, unitPrice: 49.99, location: 'WH001-A3', status: 'OUT_OF_STOCK', minStock: 30, maxStock: 100, lastUpdated: '2023-10-26T12:15:00Z' },
  { id: 'PROD005', name: 'Webcam 1080p', sku: 'WC-HD-PRO', category: 'Electronics', quantity: 80, unitPrice: 59.99, location: 'WH002-B2', status: 'APPROVED', minStock: 60, maxStock: 200, lastUpdated: '2023-10-26T08:45:00Z' },
  { id: 'PROD006', name: 'Ergonomic Chair', sku: 'EC-PREM-BLK', category: 'Furniture', quantity: 10, unitPrice: 299.99, location: 'WH001-C1', status: 'LOW_STOCK', minStock: 15, maxStock: 50, lastUpdated: '2023-10-26T13:00:00Z' },
  { id: 'PROD007', name: 'External SSD 1TB', sku: 'SSD-1TB-USB3', category: 'Storage', quantity: 70, unitPrice: 99.99, location: 'WH002-B3', status: 'APPROVED', minStock: 50, maxStock: 120, lastUpdated: '2023-10-26T14:00:00Z' },
];

const dummyOrders = [
  { id: 'ORD001', customerName: 'Alice Johnson', orderDate: '2023-10-25', totalAmount: 125.98, status: 'PENDING', items: [{ productId: 'PROD001', quantity: 2 }, { productId: 'PROD003', quantity: 1 }], workflow: [{ stage: 'New', status: 'COMPLETED', user: 'System', date: '2023-10-25T09:00:00Z', sla: 'N/A' }, { stage: 'Processing', status: 'IN_PROGRESS', user: 'Jane Doe', date: '2023-10-25T10:00:00Z', sla: '24h' }] },
  { id: 'ORD002', customerName: 'Bob Williams', orderDate: '2023-10-24', totalAmount: 79.99, status: 'APPROVED', items: [{ productId: 'PROD002', quantity: 1 }], workflow: [{ stage: 'New', status: 'COMPLETED', user: 'System', date: '2023-10-24T14:00:00Z', sla: 'N/A' }, { stage: 'Processing', status: 'COMPLETED', user: 'Jane Doe', date: '2023-10-24T15:00:00Z', sla: '24h' }, { stage: 'Ready for Shipment', status: 'COMPLETED', user: 'John Smith', date: '2023-10-24T16:30:00Z', sla: '12h' }] },
  { id: 'ORD003', customerName: 'Charlie Brown', orderDate: '2023-10-23', totalAmount: 49.99, status: 'CANCELLED', items: [{ productId: 'PROD004', quantity: 1 }], workflow: [{ stage: 'New', status: 'COMPLETED', user: 'System', date: '2023-10-23T11:00:00Z', sla: 'N/A' }, { stage: 'Processing', status: 'REJECTED', user: 'Jane Doe', date: '2023-10-23T11:30:00Z', sla: '24h', reason: 'Product out of stock' }] },
  { id: 'ORD004', customerName: 'Diana Prince', orderDate: '2023-10-22', totalAmount: 59.99, status: 'SHIPPED', items: [{ productId: 'PROD005', quantity: 1 }], workflow: [{ stage: 'New', status: 'COMPLETED', user: 'System', date: '2023-10-22T08:00:00Z', sla: 'N/A' }, { stage: 'Processing', status: 'COMPLETED', user: 'Jane Doe', date: '2023-10-22T09:00:00Z', sla: '24h' }, { stage: 'Ready for Shipment', status: 'COMPLETED', user: 'John Smith', date: '2023-10-22T10:00:00Z', sla: '12h' }, { stage: 'Shipped', status: 'COMPLETED', user: 'John Smith', date: '2023-10-22T11:00:00Z', sla: '8h' }] },
  { id: 'ORD005', customerName: 'Eve Adams', orderDate: '2023-10-21', totalAmount: 299.99, status: 'DELIVERED', items: [{ productId: 'PROD006', quantity: 1 }], workflow: [{ stage: 'New', status: 'COMPLETED', user: 'System', date: '2023-10-21T10:00:00Z', sla: 'N/A' }, { stage: 'Processing', status: 'COMPLETED', user: 'Jane Doe', date: '2023-10-21T11:00:00Z', sla: '24h' }, { stage: 'Ready for Shipment', status: 'COMPLETED', user: 'John Smith', date: '2023-10-21T12:00:00Z', sla: '12h' }, { stage: 'Shipped', status: 'COMPLETED', user: 'John Smith', date: '2023-10-21T13:00:00Z', sla: '8h' }, { stage: 'Delivered', status: 'COMPLETED', user: 'Courier', date: '2023-10-22T10:00:00Z', sla: '48h' }] },
];

const dummyShipments = [
  { id: 'SHIP001', orderId: 'ORD002', trackingNumber: 'TRK123456789', carrier: 'FedEx', shipmentDate: '2023-10-25', deliveryDate: null, status: 'SHIPPED', items: [{ productId: 'PROD002', quantity: 1 }], origin: 'WH001', destination: 'New York' },
  { id: 'SHIP002', orderId: 'ORD004', trackingNumber: 'TRK987654321', carrier: 'UPS', shipmentDate: '2023-10-23', deliveryDate: '2023-10-24', status: 'DELIVERED', items: [{ productId: 'PROD005', quantity: 1 }], origin: 'WH002', destination: 'Los Angeles' },
  { id: 'SHIP003', orderId: 'ORD005', trackingNumber: 'TRK112233445', carrier: 'DHL', shipmentDate: '2023-10-22', deliveryDate: '2023-10-23', status: 'DELIVERED', items: [{ productId: 'PROD006', quantity: 1 }], origin: 'WH001', destination: 'Chicago' },
  { id: 'SHIP004', orderId: 'ORD001', trackingNumber: 'TRK556677889', carrier: 'FedEx', shipmentDate: null, deliveryDate: null, status: 'PENDING', items: [{ productId: 'PROD001', quantity: 2 }, { productId: 'PROD003', quantity: 1 }], origin: 'WH001', destination: 'Miami' },
];

const dummyLocations = [
  { id: 'WH001', name: 'Main Warehouse A', address: '123 Enterprise Blvd, Suite 100, City, ST 12345', capacity: '5000 units', currentStock: '3000 units', manager: 'Jane Doe', status: 'ACTIVE' },
  { id: 'WH002', name: 'Auxiliary Storage B', address: '456 Innovation Dr, Unit 20, Town, ST 67890', capacity: '2000 units', currentStock: '1200 units', manager: 'John Smith', status: 'ACTIVE' },
  { id: 'WH003', name: 'Returns Processing C', address: '789 Logistics Way, Floor 5, Village, ST 11223', capacity: '1000 units', currentStock: '50 units', manager: 'Alice Green', status: 'MAINTENANCE' },
];

const dummyUsers = [
  { id: 'USR001', name: 'Admin User', email: 'admin@example.com', role: ROLES.ADMIN, lastLogin: '2023-10-26T15:00:00Z', status: 'ACTIVE' },
  { id: 'USR002', name: 'Jane Doe', email: 'jane.doe@example.com', role: ROLES.INVENTORY_MANAGER, lastLogin: '2023-10-26T14:30:00Z', status: 'ACTIVE' },
  { id: 'USR003', name: 'John Smith', email: 'john.smith@example.com', role: ROLES.WAREHOUSE_STAFF, lastLogin: '2023-10-26T14:00:00Z', status: 'ACTIVE' },
  { id: 'USR004', name: 'Emily White', email: 'emily.white@example.com', role: ROLES.FINANCE_TEAM, lastLogin: '2023-10-26T13:45:00Z', status: 'ACTIVE' },
  { id: 'USR005', name: 'David Lee', email: 'david.lee@example.com', role: ROLES.WAREHOUSE_STAFF, lastLogin: '2023-10-25T10:00:00Z', status: 'INACTIVE' },
];

const dummyActivityLog = [
  { id: 'ACT001', timestamp: '2023-10-26T15:30:00Z', user: 'Admin User', action: 'Approved Order ORD001', entityType: 'Order', entityId: 'ORD001' },
  { id: 'ACT002', timestamp: '2023-10-26T15:20:00Z', user: 'Jane Doe', action: 'Updated quantity for PROD002 to 45', entityType: 'Product', entityId: 'PROD002' },
  { id: 'ACT003', timestamp: '2023-10-26T15:10:00Z', user: 'John Smith', action: 'Marked Shipment SHIP001 as Shipped', entityType: 'Shipment', entityId: 'SHIP001' },
  { id: 'ACT004', timestamp: '2023-10-26T15:00:00Z', user: 'Admin User', action: 'Created new user David Lee', entityType: 'User', entityId: 'USR005' },
  { id: 'ACT005', timestamp: '2023-10-26T14:50:00Z', user: 'Emily White', action: 'Generated quarterly financial report', entityType: 'Report', entityId: 'N/A' },
  { id: 'ACT006', timestamp: '2023-10-26T14:40:00Z', user: 'Jane Doe', action: 'Added PROD007 (External SSD) to inventory', entityType: 'Product', entityId: 'PROD007' },
];

// --- Helper Components ---

const StatusBadge = ({ status }) => (
  <span className="status-badge" data-status={status} style={{ backgroundColor: `var(--status-${status.toLowerCase().replace(/_/g, '-')})` }}>
    {STATUS_LABELS[status] || status}
  </span>
);

const Card = ({ children, onClick, style, className }) => (
  <div className={`card ${onClick ? 'clickable' : ''} ${className || ''}`} onClick={onClick} style={style}>
    {children}
  </div>
);

const Button = ({ children, onClick, variant = 'primary', type = 'button', style, disabled }) => (
  <button
    type={type}
    className={`button button-${variant}`}
    onClick={onClick}
    style={style}
    disabled={disabled}
  >
    {children}
  </button>
);

const ChartPlaceholder = ({ title, type }) => (
  <Card className="chart-container">
    <h4 style={{ marginBottom: 'var(--spacing-sm)' }}>{title}</h4>
    <div className="chart-placeholder">
      {type} Chart Placeholder
    </div>
  </Card>
);

const Breadcrumbs = ({ path }) => (
  <div className="breadcrumbs">
    {path?.map((item, index) => (
      <React.Fragment key={item?.id || index}>
        {index > 0 && <span className="separator">/</span>}
        {item?.onClick ? (
          <a href="#" onClick={() => item.onClick(item.id)}>{item.label}</a>
        ) : (
          <span>{item?.label}</span>
        )}
      </React.Fragment>
    ))}
  </div>
);

const SearchBar = ({ searchTerm, onSearchChange, onSearchSubmit }) => (
  <form onSubmit={onSearchSubmit} className="search-bar">
    <input
      type="text"
      placeholder="Global Search..."
      value={searchTerm}
      onChange={onSearchChange}
    />
  </form>
);

const DetailItem = ({ label, value, render }) => (
  <div className="detail-item">
    <span className="label">{label}</span>
    <span className="value">{render ? render(value) : value}</span>
  </div>
);

// --- Screens ---

const DashboardScreen = ({ navigate, currentUser }) => {
  const lastUpdated = new Date().toLocaleString();
  const lowStockProducts = dummyProducts.filter(p => p.status === 'LOW_STOCK' || p.status === 'OUT_OF_STOCK');
  const pendingOrders = dummyOrders.filter(o => o.status === 'PENDING');
  const recentActivities = dummyActivityLog.slice(0, 5);

  return (
    <>
      <Breadcrumbs path={[{ label: 'Dashboard' }]} />
      <div className="main-content-header">
        <h1>Dashboard</h1>
        <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>Last updated: {lastUpdated}</div>
      </div>

      <h2 style={{ marginBottom: 'var(--spacing-md)' }}>Key Performance Indicators</h2>
      <div className="card-grid" style={{ marginBottom: 'var(--spacing-lg)' }}>
        <Card className="kpi-card">
          <div className="value">{dummyProducts?.length || 0}</div>
          <div className="label">Total Products</div>
        </Card>
        <Card className="kpi-card" onClick={() => navigate('PRODUCTS', { status: 'LOW_STOCK' })}>
          <div className="value" style={{ color: 'var(--color-danger)' }}>{lowStockProducts?.length || 0}</div>
          <div className="label">Low/Out of Stock</div>
        </Card>
        <Card className="kpi-card" onClick={() => navigate('ORDERS', { status: 'PENDING' })}>
          <div className="value" style={{ color: 'var(--color-warning)' }}>{pendingOrders?.length || 0}</div>
          <div className="label">Pending Orders</div>
        </Card>
        <Card className="kpi-card">
          <div className="value">{(dummyShipments?.filter(s => s.status === 'DELIVERED')?.length || 0)}</div>
          <div className="label">Delivered Shipments</div>
        </Card>
      </div>

      <h2 style={{ marginBottom: 'var(--spacing-md)' }}>Inventory Trends</h2>
      <div className="card-grid" style={{ marginBottom: 'var(--spacing-lg)' }}>
        <ChartPlaceholder title="Product Quantity Trend" type="Line" />
        <ChartPlaceholder title="Stock Status Distribution" type="Donut" />
      </div>

      <h2 style={{ marginBottom: 'var(--spacing-md)' }}>Recent Activities</h2>
      <Card style={{ padding: 'var(--spacing-lg)' }}>
        <ul className="recent-activities-list">
          {recentActivities?.map(activity => (
            <li key={activity?.id}>
              <div className="activity-icon">🔔</div>
              <div className="activity-details">
                <p>{activity?.action} {activity?.entityType === 'Order' && <a href="#" onClick={() => navigate('ORDER_DETAIL', { id: activity?.entityId })}>{activity?.entityId}</a>}</p>
                <span className="timestamp">{new Date(activity?.timestamp).toLocaleString()} by {activity?.user}</span>
              </div>
            </li>
          ))}
        </ul>
        <div style={{ marginTop: 'var(--spacing-md)', textAlign: 'right' }}>
          <Button variant="text" onClick={() => alert('View all activities (simulated)')}>View All Activities</Button>
        </div>
      </Card>

      {(currentUser?.role === ROLES.ADMIN || currentUser?.role === ROLES.INVENTORY_MANAGER) && (
        <div style={{ marginTop: 'var(--spacing-xl)' }}>
          <h2 style={{ marginBottom: 'var(--spacing-md)' }}>Quick Actions</h2>
          <div className="card-grid">
            <Card onClick={() => navigate('PRODUCT_FORM')}>
              <h4 style={{ marginBottom: 'var(--spacing-sm)' }}>Add New Product</h4>
              <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>Quickly add new inventory items to the system.</p>
            </Card>
            <Card onClick={() => navigate('ORDER_FORM')}>
              <h4 style={{ marginBottom: 'var(--spacing-sm)' }}>Create New Order</h4>
              <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>Initiate a new customer order or transfer.</p>
            </Card>
            <Card onClick={() => alert('Generate Report (simulated)')}>
              <h4 style={{ marginBottom: 'var(--spacing-sm)' }}>Generate Inventory Report</h4>
              <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>Create detailed reports on stock levels and movements.</p>
            </Card>
          </div>
        </div>
      )}
    </>
  );
};

const ProductListScreen = ({ navigate, initialFilterStatus, currentUser }) => {
  const [products, setProducts] = useState(dummyProducts);
  const [filter, setFilter] = useState(initialFilterStatus || '');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortKey, setSortKey] = useState('name');
  const [sortDirection, setSortDirection] = useState('asc');

  const filteredProducts = products
    ?.filter(p => !filter || p?.status === filter)
    ?.filter(p => p?.name?.toLowerCase().includes(searchTerm.toLowerCase()) || p?.sku?.toLowerCase().includes(searchTerm.toLowerCase()))
    ?.sort((a, b) => {
      const aValue = a?.[sortKey];
      const bValue = b?.[sortKey];
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortDirection === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
      }
      return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
    });

  const handleSort = (key) => {
    if (sortKey === key) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortDirection('asc');
    }
  };

  const hasPermission = (permissionRole) => currentUser?.role === ROLES.ADMIN || currentUser?.role === permissionRole;

  return (
    <>
      <Breadcrumbs path={[{ label: 'Products', onClick: () => navigate('PRODUCTS') }]} />
      <div className="main-content-header">
        <h1>Products</h1>
        <div style={{ display: 'flex', gap: 'var(--spacing-md)' }}>
          <SearchBar
            searchTerm={searchTerm}
            onSearchChange={(e) => setSearchTerm(e.target.value)}
            onSearchSubmit={(e) => { e.preventDefault(); alert(`Searching for: ${searchTerm}`); }}
          />
          <Button variant="outline" onClick={() => alert('Open filter panel (simulated)')}>Filter</Button>
          {hasPermission(ROLES.INVENTORY_MANAGER) && (
            <Button onClick={() => navigate('PRODUCT_FORM')}>Add Product</Button>
          )}
        </div>
      </div>

      <Card style={{ padding: 'var(--spacing-lg)' }}>
        <h3 style={{ marginBottom: 'var(--spacing-md)' }}>Inventory List ({filter ? STATUS_LABELS[filter] : 'All'})</h3>
        <div style={{ display: 'flex', gap: 'var(--spacing-md)', marginBottom: 'var(--spacing-md)' }}>
          <Button variant={filter === '' ? 'primary' : 'outline'} onClick={() => setFilter('')}>All ({dummyProducts?.length})</Button>
          <Button variant={filter === 'LOW_STOCK' ? 'primary' : 'outline'} onClick={() => setFilter('LOW_STOCK')}>Low Stock ({dummyProducts?.filter(p => p.status === 'LOW_STOCK')?.length})</Button>
          <Button variant={filter === 'OUT_OF_STOCK' ? 'primary' : 'outline'} onClick={() => setFilter('OUT_OF_STOCK')}>Out of Stock ({dummyProducts?.filter(p => p.status === 'OUT_OF_STOCK')?.length})</Button>
        </div>
        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th onClick={() => handleSort('name')}>Product Name</th>
                <th onClick={() => handleSort('sku')}>SKU</th>
                <th onClick={() => handleSort('quantity')}>Quantity</th>
                <th onClick={() => handleSort('location')}>Location</th>
                <th onClick={() => handleSort('status')}>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {(filteredProducts?.length === 0) ? (
                <tr><td colSpan="6">No products found matching criteria.</td></tr>
              ) : (
                filteredProducts?.map(product => (
                  <tr key={product?.id} onClick={() => navigate('PRODUCT_DETAIL', { id: product?.id })}>
                    <td>{product?.name}</td>
                    <td>{product?.sku}</td>
                    <td>{product?.quantity}</td>
                    <td>{product?.location}</td>
                    <td><StatusBadge status={product?.status} /></td>
                    <td className="actions" onClick={(e) => e.stopPropagation()}>
                      {hasPermission(ROLES.WAREHOUSE_STAFF) && (
                        <Button variant="outline" size="sm" onClick={() => navigate('PRODUCT_EDIT', { id: product?.id })}>Edit</Button>
                      )}
                      {hasPermission(ROLES.ADMIN) && (
                        <Button variant="danger" size="sm" onClick={() => alert(`Delete ${product?.name} (simulated)`)}>Delete</Button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <div style={{ marginTop: 'var(--spacing-lg)', textAlign: 'right' }}>
          <Button variant="outline" onClick={() => alert('Export Products (simulated)')}>Export to Excel/PDF</Button>
        </div>
      </Card>
    </>
  );
};

const ProductDetailScreen = ({ navigate, productId, currentUser }) => {
  const product = dummyProducts?.find(p => p.id === productId);

  if (!product) {
    return (
      <Card>
        <h2>Product Not Found</h2>
        <p>The product with ID {productId} does not exist.</p>
        <Button onClick={() => navigate('PRODUCTS')}>Back to Products</Button>
      </Card>
    );
  }

  const relatedOrders = dummyOrders?.filter(order => order?.items?.some(item => item?.productId === productId));
  const hasPermission = (permissionRole) => currentUser?.role === ROLES.ADMIN || currentUser?.role === permissionRole;

  return (
    <>
      <Breadcrumbs path={[
        { label: 'Products', onClick: () => navigate('PRODUCTS') },
        { label: product?.name }
      ]} />
      <div className="main-content-header">
        <h1>{product?.name}</h1>
        <div style={{ display: 'flex', gap: 'var(--spacing-md)' }}>
          {hasPermission(ROLES.INVENTORY_MANAGER) && (
            <Button variant="primary" onClick={() => navigate('PRODUCT_EDIT', { id: product?.id })}>Edit Product</Button>
          )}
          {hasPermission(ROLES.WAREHOUSE_STAFF) && (
            <Button variant="secondary" onClick={() => alert(`Initiate stock transfer for ${product?.name} (simulated)`)}>Transfer Stock</Button>
          )}
          {hasPermission(ROLES.ADMIN) && (
            <Button variant="danger" onClick={() => alert(`Delete ${product?.name} (simulated)`)}>Delete Product</Button>
          )}
        </div>
      </div>

      <Card style={{ padding: 'var(--spacing-lg)' }}>
        <div className="detail-section">
          <h3>Product Information <StatusBadge status={product?.status} /></h3>
          <div className="detail-grid">
            <DetailItem label="SKU" value={product?.sku} />
            <DetailItem label="Category" value={product?.category} />
            <DetailItem label="Current Quantity" value={product?.quantity} />
            <DetailItem label="Unit Price" value={`$${product?.unitPrice?.toFixed(2)}`} />
            <DetailItem label="Location" value={product?.location} />
            <DetailItem label="Min Stock Level" value={product?.minStock} />
            <DetailItem label="Max Stock Level" value={product?.maxStock} />
            <DetailItem label="Last Updated" value={new Date(product?.lastUpdated).toLocaleString()} />
          </div>
        </div>

        <div className="detail-section">
          <h3>Related Orders</h3>
          {relatedOrders?.length > 0 ? (
            <div className="table-responsive">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Customer</th>
                    <th>Order Date</th>
                    <th>Quantity</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {relatedOrders?.map(order => (
                    <tr key={order?.id} onClick={() => navigate('ORDER_DETAIL', { id: order?.id })}>
                      <td>{order?.id}</td>
                      <td>{order?.customerName}</td>
                      <td>{order?.orderDate}</td>
                      <td>{order?.items?.find(item => item?.productId === productId)?.quantity}</td>
                      <td><StatusBadge status={order?.status} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p style={{ color: 'var(--color-text-secondary)' }}>No related orders found for this product.</p>
          )}
        </div>

        {hasPermission(ROLES.ADMIN) && (
          <div className="detail-section">
            <h3>Audit Log</h3>
            <Card style={{ padding: 'var(--spacing-md)', boxShadow: 'none', border: '1px solid var(--color-border)' }}>
              {dummyActivityLog
                ?.filter(log => log?.entityType === 'Product' && log?.entityId === productId)
                ?.map(log => (
                  <div key={log?.id} className="audit-log-entry">
                    <div className="timestamp">{new Date(log?.timestamp).toLocaleString()}</div>
                    <div className="details"><strong>{log?.user}:</strong> {log?.action}</div>
                  </div>
                ))}
            </Card>
          </div>
        )}
      </Card>
    </>
  );
};

const ProductFormScreen = ({ navigate, productId, currentUser }) => {
  const isEdit = !!productId;
  const existingProduct = isEdit ? dummyProducts?.find(p => p.id === productId) : null;

  const [formData, setFormData] = useState({
    name: existingProduct?.name || '',
    sku: existingProduct?.sku || '',
    category: existingProduct?.category || '',
    quantity: existingProduct?.quantity || '',
    unitPrice: existingProduct?.unitPrice || '',
    location: existingProduct?.location || 'WH001-A1',
    minStock: existingProduct?.minStock || '',
    maxStock: existingProduct?.maxStock || '',
    status: existingProduct?.status || 'NEW',
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (!isEdit && currentUser?.role !== ROLES.ADMIN && currentUser?.role !== ROLES.INVENTORY_MANAGER) {
      alert('You do not have permission to add products.');
      navigate('PRODUCTS');
    } else if (isEdit && !(currentUser?.role === ROLES.ADMIN || currentUser?.role === ROLES.INVENTORY_MANAGER || currentUser?.role === ROLES.WAREHOUSE_STAFF)) {
      alert('You do not have permission to edit products.');
      navigate('PRODUCT_DETAIL', { id: productId });
    }
  }, [currentUser, isEdit, productId, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData?.name) newErrors.name = 'Product Name is required.';
    if (!formData?.sku) newErrors.sku = 'SKU is required.';
    if (!formData?.category) newErrors.category = 'Category is required.';
    if (!formData?.quantity || formData?.quantity < 0) newErrors.quantity = 'Quantity must be a positive number.';
    if (!formData?.unitPrice || formData?.unitPrice <= 0) newErrors.unitPrice = 'Unit Price must be greater than zero.';
    if (!formData?.location) newErrors.location = 'Location is required.';
    if (!formData?.minStock || formData?.minStock < 0) newErrors.minStock = 'Min Stock must be a non-negative number.';
    if (!formData?.maxStock || formData?.maxStock < formData?.minStock) newErrors.maxStock = 'Max Stock must be greater than Min Stock.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      const updatedProduct = {
        ...existingProduct,
        ...formData,
        id: isEdit ? productId : `PROD${String(dummyProducts?.length + 1).padStart(3, '0')}`,
        lastUpdated: new Date().toISOString(),
      };
      // In a real app, send to API. For dummy data, update directly.
      if (isEdit) {
        const index = dummyProducts?.findIndex(p => p.id === productId);
        if (index !== -1) {
          dummyProducts[index] = updatedProduct; // Directly modify dummy data for this example
        }
      } else {
        dummyProducts.push(updatedProduct); // Directly modify dummy data for this example
      }
      alert(`Product ${isEdit ? 'updated' : 'added'} successfully! (Simulated)`);
      navigate('PRODUCT_DETAIL', { id: updatedProduct?.id });
    }
  };

  const breadcrumbPath = [
    { label: 'Products', onClick: () => navigate('PRODUCTS') },
    isEdit ? { label: existingProduct?.name, onClick: () => navigate('PRODUCT_DETAIL', { id: existingProduct?.id }) } : null,
    { label: isEdit ? 'Edit Product' : 'Add Product' }
  ].filter(Boolean);

  return (
    <>
      <Breadcrumbs path={breadcrumbPath} />
      <div className="main-content-header">
        <h1>{isEdit ? `Edit Product: ${existingProduct?.name}` : 'Add New Product'}</h1>
      </div>

      <Card style={{ padding: 'var(--spacing-lg)' }}>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Product Name <span style={{ color: 'var(--color-danger)' }}>*</span></label>
            <input type="text" id="name" name="name" value={formData?.name} onChange={handleChange} />
            {errors?.name && <p className="error-message">{errors?.name}</p>}
          </div>
          <div className="form-group">
            <label htmlFor="sku">SKU <span style={{ color: 'var(--color-danger)' }}>*</span></label>
            <input type="text" id="sku" name="sku" value={formData?.sku} onChange={handleChange} />
            {errors?.sku && <p className="error-message">{errors?.sku}</p>}
          </div>
          <div className="form-group">
            <label htmlFor="category">Category <span style={{ color: 'var(--color-danger)' }}>*</span></label>
            <input type="text" id="category" name="category" value={formData?.category} onChange={handleChange} />
            {errors?.category && <p className="error-message">{errors?.category}</p>}
          </div>
          <div className="form-group">
            <label htmlFor="quantity">Quantity <span style={{ color: 'var(--color-danger)' }}>*</span></label>
            <input type="number" id="quantity" name="quantity" value={formData?.quantity} onChange={handleChange} />
            {errors?.quantity && <p className="error-message">{errors?.quantity}</p>}
          </div>
          <div className="form-group">
            <label htmlFor="unitPrice">Unit Price <span style={{ color: 'var(--color-danger)' }}>*</span></label>
            <input type="number" id="unitPrice" name="unitPrice" step="0.01" value={formData?.unitPrice} onChange={handleChange} />
            {errors?.unitPrice && <p className="error-message">{errors?.unitPrice}</p>}
          </div>
          <div className="form-group">
            <label htmlFor="location">Location <span style={{ color: 'var(--color-danger)' }}>*</span></label>
            <select id="location" name="location" value={formData?.location} onChange={handleChange}>
              <option value="">Select Location</option>
              {dummyLocations?.map(loc => (
                <option key={loc?.id} value={`${loc?.id}-A1`}>{loc?.name} - A1</option>
              ))}
            </select>
            {errors?.location && <p className="error-message">{errors?.location}</p>}
          </div>
          <div className="form-group">
            <label htmlFor="minStock">Minimum Stock Level <span style={{ color: 'var(--color-danger)' }}>*</span></label>
            <input type="number" id="minStock" name="minStock" value={formData?.minStock} onChange={handleChange} />
            {errors?.minStock && <p className="error-message">{errors?.minStock}</p>}
          </div>
          <div className="form-group">
            <label htmlFor="maxStock">Maximum Stock Level <span style={{ color: 'var(--color-danger)' }}>*</span></label>
            <input type="number" id="maxStock" name="maxStock" value={formData?.maxStock} onChange={handleChange} />
            {errors?.maxStock && <p className="error-message">{errors?.maxStock}</p>}
          </div>
          <div className="form-group">
            <label htmlFor="status">Status</label>
            <select id="status" name="status" value={formData?.status} onChange={handleChange}>
              {Object.keys(STATUS_LABELS)?.map(key => (
                <option key={key} value={key}>{STATUS_LABELS[key]}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="fileUpload">Product Image / Document Upload</label>
            <input type="file" id="fileUpload" name="fileUpload" onChange={(e) => alert(`File ${e?.target?.files?.[0]?.name} uploaded (simulated)`)} />
          </div>

          <div className="form-actions">
            <Button type="submit" variant="primary">{isEdit ? 'Save Changes' : 'Add Product'}</Button>
            <Button type="button" variant="outline" onClick={() => (isEdit ? navigate('PRODUCT_DETAIL', { id: productId }) : navigate('PRODUCTS'))}>Cancel</Button>
          </div>
        </form>
      </Card>
    </>
  );
};

const OrderListScreen = ({ navigate, initialFilterStatus }) => {
  const [orders, setOrders] = useState(dummyOrders);
  const [filter, setFilter] = useState(initialFilterStatus || '');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortKey, setSortKey] = useState('orderDate');
  const [sortDirection, setSortDirection] = useState('desc');

  const filteredOrders = orders
    ?.filter(o => !filter || o?.status === filter)
    ?.filter(o => o?.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) || o?.id?.toLowerCase().includes(searchTerm.toLowerCase()))
    ?.sort((a, b) => {
      const aValue = a?.[sortKey];
      const bValue = b?.[sortKey];
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortDirection === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
      }
      return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
    });

  const handleSort = (key) => {
    if (sortKey === key) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortDirection('desc'); // Default to desc for dates/numbers, asc for strings
    }
  };

  return (
    <>
      <Breadcrumbs path={[{ label: 'Orders', onClick: () => navigate('ORDERS') }]} />
      <div className="main-content-header">
        <h1>Orders</h1>
        <div style={{ display: 'flex', gap: 'var(--spacing-md)' }}>
          <SearchBar
            searchTerm={searchTerm}
            onSearchChange={(e) => setSearchTerm(e.target.value)}
            onSearchSubmit={(e) => { e.preventDefault(); alert(`Searching for order: ${searchTerm}`); }}
          />
          <Button variant="outline" onClick={() => alert('Open filter panel (simulated)')}>Filter</Button>
          <Button onClick={() => navigate('ORDER_FORM')}>New Order</Button>
        </div>
      </div>

      <Card style={{ padding: 'var(--spacing-lg)' }}>
        <h3 style={{ marginBottom: 'var(--spacing-md)' }}>Order List ({filter ? STATUS_LABELS[filter] : 'All'})</h3>
        <div style={{ display: 'flex', gap: 'var(--spacing-md)', marginBottom: 'var(--spacing-md)' }}>
          <Button variant={filter === '' ? 'primary' : 'outline'} onClick={() => setFilter('')}>All ({dummyOrders?.length})</Button>
          <Button variant={filter === 'PENDING' ? 'primary' : 'outline'} onClick={() => setFilter('PENDING')}>Pending ({dummyOrders?.filter(o => o.status === 'PENDING')?.length})</Button>
          <Button variant={filter === 'SHIPPED' ? 'primary' : 'outline'} onClick={() => setFilter('SHIPPED')}>Shipped ({dummyOrders?.filter(o => o.status === 'SHIPPED')?.length})</Button>
          <Button variant={filter === 'DELIVERED' ? 'primary' : 'outline'} onClick={() => setFilter('DELIVERED')}>Delivered ({dummyOrders?.filter(o => o.status === 'DELIVERED')?.length})</Button>
        </div>
        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th onClick={() => handleSort('id')}>Order ID</th>
                <th onClick={() => handleSort('customerName')}>Customer Name</th>
                <th onClick={() => handleSort('orderDate')}>Order Date</th>
                <th onClick={() => handleSort('totalAmount')}>Total Amount</th>
                <th onClick={() => handleSort('status')}>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders?.map(order => (
                <tr key={order?.id} onClick={() => navigate('ORDER_DETAIL', { id: order?.id })}>
                  <td>{order?.id}</td>
                  <td>{order?.customerName}</td>
                  <td>{order?.orderDate}</td>
                  <td>${order?.totalAmount?.toFixed(2)}</td>
                  <td><StatusBadge status={order?.status} /></td>
                  <td className="actions" onClick={(e) => e.stopPropagation()}>
                    <Button variant="outline" size="sm" onClick={() => navigate('ORDER_EDIT', { id: order?.id })}>Edit</Button>
                    <Button variant="text" size="sm" onClick={() => alert(`View shipment for ${order?.id} (simulated)`)}>Shipment</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div style={{ marginTop: 'var(--spacing-lg)', textAlign: 'right' }}>
          <Button variant="outline" onClick={() => alert('Export Orders (simulated)')}>Export to Excel/PDF</Button>
        </div>
      </Card>
    </>
  );
};

const OrderDetailScreen = ({ navigate, orderId, currentUser }) => {
  const order = dummyOrders?.find(o => o.id === orderId);
  const relatedShipment = dummyShipments?.find(s => s.orderId === orderId);

  if (!order) {
    return (
      <Card>
        <h2>Order Not Found</h2>
        <p>The order with ID {orderId} does not exist.</p>
        <Button onClick={() => navigate('ORDERS')}>Back to Orders</Button>
      </Card>
    );
  }

  const hasPermission = (permissionRole) => currentUser?.role === ROLES.ADMIN || currentUser?.role === permissionRole;
  const currentWorkflowStage = order?.workflow?.[order?.workflow?.length - 1];

  return (
    <>
      <Breadcrumbs path={[
        { label: 'Orders', onClick: () => navigate('ORDERS') },
        { label: order?.id }
      ]} />
      <div className="main-content-header">
        <h1>Order {order?.id}</h1>
        <div style={{ display: 'flex', gap: 'var(--spacing-md)' }}>
          {hasPermission(ROLES.INVENTORY_MANAGER) && (
            <Button variant="primary" onClick={() => navigate('ORDER_EDIT', { id: order?.id })}>Edit Order</Button>
          )}
          {hasPermission(ROLES.WAREHOUSE_STAFF) && order?.status === 'APPROVED' && (
            <Button variant="secondary" onClick={() => alert(`Create shipment for ${order?.id} (simulated)`)}>Create Shipment</Button>
          )}
          {hasPermission(ROLES.ADMIN) && (
            <Button variant="danger" onClick={() => alert(`Cancel Order ${order?.id} (simulated)`)}>Cancel Order</Button>
          )}
        </div>
      </div>

      <Card style={{ padding: 'var(--spacing-lg)' }}>
        <div className="detail-section">
          <h3>Order Details <StatusBadge status={order?.status} /></h3>
          <div className="detail-grid">
            <DetailItem label="Customer Name" value={order?.customerName} />
            <DetailItem label="Order Date" value={order?.orderDate} />
            <DetailItem label="Total Amount" value={`$${order?.totalAmount?.toFixed(2)}`} />
          </div>
        </div>

        <div className="detail-section">
          <h3>Items</h3>
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Product Name</th>
                  <th>SKU</th>
                  <th>Quantity</th>
                  <th>Unit Price</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                {order?.items?.map((item, index) => {
                  const product = dummyProducts?.find(p => p.id === item?.productId);
                  return (
                    <tr key={index} onClick={() => navigate('PRODUCT_DETAIL', { id: product?.id })}>
                      <td>{product?.name}</td>
                      <td>{product?.sku}</td>
                      <td>{item?.quantity}</td>
                      <td>${product?.unitPrice?.toFixed(2)}</td>
                      <td>${(product?.unitPrice * item?.quantity)?.toFixed(2)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        <div className="detail-section">
          <h3>Workflow Status</h3>
          <div className="workflow-tracker">
            {order?.workflow?.map((stage, index) => (
              <div
                key={index}
                className={`workflow-stage ${stage?.status === 'COMPLETED' ? 'completed' : ''} ${stage?.status === 'IN_PROGRESS' ? 'active' : ''}`}
              >
                <div className="icon">{index + 1}</div>
                <div className="details">
                  <div className="title">{stage?.stage}</div>
                  <div className="meta">
                    Status: <StatusBadge status={stage?.status} />
                    {stage?.user && ` by ${stage?.user}`}
                    {stage?.date && ` on ${new Date(stage?.date).toLocaleString()}`}
                    {stage?.sla && ` (SLA: ${stage?.sla} ${stage?.status !== 'COMPLETED' && new Date() > new Date(new Date(stage?.date).getTime() + (stage?.sla === '24h' ? 24 * 60 * 60 * 1000 : 0)) ? ' - BREACHED!' : ''})`}
                    {stage?.reason && <span style={{ color: 'var(--color-danger)', marginLeft: 'var(--spacing-xs)' }}>Reason: {stage?.reason}</span>}
                  </div>
                </div>
              </div>
            ))}
            {currentWorkflowStage?.status !== 'COMPLETED' && hasPermission(ROLES.INVENTORY_MANAGER) && (
              <Button onClick={() => alert(`Advance workflow for Order ${order?.id} (simulated)`)} style={{ alignSelf: 'flex-start', marginTop: 'var(--spacing-md)' }}>
                Advance Workflow
              </Button>
            )}
          </div>
        </div>

        {relatedShipment && (
          <div className="detail-section">
            <h3>Related Shipment</h3>
            <Card onClick={() => navigate('SHIPMENT_DETAIL', { id: relatedShipment?.id })} className="clickable">
              <div className="detail-grid">
                <DetailItem label="Tracking Number" value={relatedShipment?.trackingNumber} />
                <DetailItem label="Carrier" value={relatedShipment?.carrier} />
                <DetailItem label="Shipment Date" value={relatedShipment?.shipmentDate} />
                <DetailItem label="Status" render={(val) => <StatusBadge status={val} />} value={relatedShipment?.status} />
              </div>
            </Card>
          </div>
        )}

        {hasPermission(ROLES.FINANCE_TEAM) && (
          <div className="detail-section">
            <h3>Documents</h3>
            <div style={{ display: 'flex', gap: 'var(--spacing-md)' }}>
              <Button variant="outline" onClick={() => alert('View Invoice (simulated)')}>View Invoice</Button>
              <Button variant="outline" onClick={() => alert('View Purchase Order (simulated)')}>View PO</Button>
            </div>
          </div>
        )}
      </Card>
    </>
  );
};

const ShipmentListScreen = ({ navigate, currentUser }) => {
  const [shipments, setShipments] = useState(dummyShipments);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredShipments = shipments?.filter(s =>
    s?.trackingNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s?.orderId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s?.carrier?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <Breadcrumbs path={[{ label: 'Shipments', onClick: () => navigate('SHIPMENTS') }]} />
      <div className="main-content-header">
        <h1>Shipments</h1>
        <div style={{ display: 'flex', gap: 'var(--spacing-md)' }}>
          <SearchBar
            searchTerm={searchTerm}
            onSearchChange={(e) => setSearchTerm(e.target.value)}
            onSearchSubmit={(e) => { e.preventDefault(); alert(`Searching for shipment: ${searchTerm}`); }}
          />
          {(currentUser?.role === ROLES.ADMIN || currentUser?.role === ROLES.WAREHOUSE_STAFF) && (
            <Button onClick={() => navigate('SHIPMENT_FORM')}>New Shipment</Button>
          )}
        </div>
      </div>

      <Card style={{ padding: 'var(--spacing-lg)' }}>
        <h3 style={{ marginBottom: 'var(--spacing-md)' }}>Shipment Tracking</h3>
        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>Tracking Number</th>
                <th>Order ID</th>
                <th>Carrier</th>
                <th>Shipment Date</th>
                <th>Delivery Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredShipments?.map(shipment => (
                <tr key={shipment?.id} onClick={() => navigate('SHIPMENT_DETAIL', { id: shipment?.id })}>
                  <td>{shipment?.trackingNumber}</td>
                  <td><a href="#" onClick={(e) => { e.stopPropagation(); navigate('ORDER_DETAIL', { id: shipment?.orderId }); }}>{shipment?.orderId}</a></td>
                  <td>{shipment?.carrier}</td>
                  <td>{shipment?.shipmentDate || 'N/A'}</td>
                  <td>{shipment?.deliveryDate || 'N/A'}</td>
                  <td><StatusBadge status={shipment?.status} /></td>
                  <td className="actions" onClick={(e) => e.stopPropagation()}>
                    {(currentUser?.role === ROLES.ADMIN || currentUser?.role === ROLES.WAREHOUSE_STAFF) && (
                      <Button variant="outline" size="sm" onClick={() => navigate('SHIPMENT_EDIT', { id: shipment?.id })}>Edit</Button>
                    )}
                    {(currentUser?.role === ROLES.ADMIN || currentUser?.role === ROLES.WAREHOUSE_STAFF) && shipment?.status !== 'DELIVERED' && (
                      <Button variant="secondary" size="sm" onClick={() => alert(`Update status for ${shipment?.id} (simulated)`)}>Update Status</Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div style={{ marginTop: 'var(--spacing-lg)', textAlign: 'right' }}>
          <Button variant="outline" onClick={() => alert('Export Shipments (simulated)')}>Export to Excel/PDF</Button>
        </div>
      </Card>
    </>
  );
};

const ShipmentDetailScreen = ({ navigate, shipmentId, currentUser }) => {
  const shipment = dummyShipments?.find(s => s.id === shipmentId);

  if (!shipment) {
    return (
      <Card>
        <h2>Shipment Not Found</h2>
        <p>The shipment with ID {shipmentId} does not exist.</p>
        <Button onClick={() => navigate('SHIPMENTS')}>Back to Shipments</Button>
      </Card>
    );
  }

  const relatedOrder = dummyOrders?.find(o => o.id === shipment?.orderId);
  const hasPermission = (permissionRole) => currentUser?.role === ROLES.ADMIN || currentUser?.role === permissionRole;

  return (
    <>
      <Breadcrumbs path={[
        { label: 'Shipments', onClick: () => navigate('SHIPMENTS') },
        { label: shipment?.trackingNumber }
      ]} />
      <div className="main-content-header">
        <h1>Shipment: {shipment?.trackingNumber}</h1>
        <div style={{ display: 'flex', gap: 'var(--spacing-md)' }}>
          {hasPermission(ROLES.WAREHOUSE_STAFF) && shipment?.status !== 'DELIVERED' && (
            <Button variant="primary" onClick={() => navigate('SHIPMENT_EDIT', { id: shipment?.id })}>Update Status</Button>
          )}
          {hasPermission(ROLES.ADMIN) && (
            <Button variant="danger" onClick={() => alert(`Cancel Shipment ${shipment?.id} (simulated)`)}>Cancel Shipment</Button>
          )}
        </div>
      </div>

      <Card style={{ padding: 'var(--spacing-lg)' }}>
        <div className="detail-section">
          <h3>Shipment Information <StatusBadge status={shipment?.status} /></h3>
          <div className="detail-grid">
            <DetailItem label="Tracking Number" value={shipment?.trackingNumber} />
            <DetailItem label="Carrier" value={shipment?.carrier} />
            <DetailItem label="Origin" value={shipment?.origin} />
            <DetailItem label="Destination" value={shipment?.destination} />
            <DetailItem label="Shipment Date" value={shipment?.shipmentDate || 'N/A'} />
            <DetailItem label="Estimated Delivery" value={new Date(new Date(shipment?.shipmentDate).getTime() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] || 'N/A'} />
            <DetailItem label="Actual Delivery Date" value={shipment?.deliveryDate || 'N/A'} />
          </div>
        </div>

        {relatedOrder && (
          <div className="detail-section">
            <h3>Related Order</h3>
            <Card onClick={() => navigate('ORDER_DETAIL', { id: relatedOrder?.id })} className="clickable">
              <div className="detail-grid">
                <DetailItem label="Order ID" value={relatedOrder?.id} />
                <DetailItem label="Customer" value={relatedOrder?.customerName} />
                <DetailItem label="Order Date" value={relatedOrder?.orderDate} />
                <DetailItem label="Total Amount" value={`$${relatedOrder?.totalAmount?.toFixed(2)}`} />
              </div>
            </Card>
          </div>
        )}

        <div className="detail-section">
          <h3>Items in Shipment</h3>
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Product Name</th>
                  <th>SKU</th>
                  <th>Quantity</th>
                </tr>
              </thead>
              <tbody>
                {shipment?.items?.map((item, index) => {
                  const product = dummyProducts?.find(p => p.id === item?.productId);
                  return (
                    <tr key={index} onClick={() => navigate('PRODUCT_DETAIL', { id: product?.id })}>
                      <td>{product?.name}</td>
                      <td>{product?.sku}</td>
                      <td>{item?.quantity}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </Card>
    </>
  );
};

const LocationListScreen = ({ navigate, currentUser }) => {
  const [locations, setLocations] = useState(dummyLocations);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredLocations = locations?.filter(loc =>
    loc?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    loc?.address?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    loc?.manager?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <Breadcrumbs path={[{ label: 'Locations', onClick: () => navigate('LOCATIONS') }]} />
      <div className="main-content-header">
        <h1>Locations</h1>
        <div style={{ display: 'flex', gap: 'var(--spacing-md)' }}>
          <SearchBar
            searchTerm={searchTerm}
            onSearchChange={(e) => setSearchTerm(e.target.value)}
            onSearchSubmit={(e) => { e.preventDefault(); alert(`Searching for location: ${searchTerm}`); }}
          />
          {(currentUser?.role === ROLES.ADMIN) && (
            <Button onClick={() => alert('Add Location (simulated)')}>Add Location</Button>
          )}
        </div>
      </div>

      <Card style={{ padding: 'var(--spacing-lg)' }}>
        <h3 style={{ marginBottom: 'var(--spacing-md)' }}>Warehouse & Storage Facilities</h3>
        <div className="card-grid">
          {filteredLocations?.map(loc => (
            <Card key={loc?.id} onClick={() => alert(`View details for ${loc?.name} (simulated)`)}>
              <h4 style={{ marginBottom: 'var(--spacing-sm)' }}>{loc?.name} <StatusBadge status={loc?.status} /></h4>
              <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)', marginBottom: 'var(--spacing-xs)' }}>{loc?.address}</p>
              <div className="detail-grid" style={{ gridTemplateColumns: '1fr 1fr', fontSize: 'var(--font-size-xs)', gap: 'var(--spacing-xs)' }}>
                <DetailItem label="Capacity" value={loc?.capacity} />
                <DetailItem label="Current Stock" value={loc?.currentStock} />
                <DetailItem label="Manager" value={loc?.manager} />
              </div>
              <div style={{ marginTop: 'var(--spacing-md)', textAlign: 'right' }}>
                {(currentUser?.role === ROLES.ADMIN || currentUser?.role === ROLES.WAREHOUSE_STAFF) && (
                  <Button variant="text" onClick={(e) => { e.stopPropagation(); alert(`Edit ${loc?.name} (simulated)`); }}>Edit</Button>
                )}
              </div>
            </Card>
          ))}
        </div>
      </Card>
    </>
  );
};

const UserListScreen = ({ navigate, currentUser }) => {
  const [users, setUsers] = useState(dummyUsers);
  const [searchTerm, setSearchTerm] = useState('');

  if (currentUser?.role !== ROLES.ADMIN) {
    return (
      <Card>
        <h2>Access Denied</h2>
        <p>You do not have permission to view this page.</p>
        <Button onClick={() => navigate('DASHBOARD')}>Back to Dashboard</Button>
      </Card>
    );
  }

  const filteredUsers = users?.filter(user =>
    user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user?.role?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <Breadcrumbs path={[{ label: 'Users', onClick: () => navigate('USERS') }]} />
      <div className="main-content-header">
        <h1>Users</h1>
        <div style={{ display: 'flex', gap: 'var(--spacing-md)' }}>
          <SearchBar
            searchTerm={searchTerm}
            onSearchChange={(e) => setSearchTerm(e.target.value)}
            onSearchSubmit={(e) => { e.preventDefault(); alert(`Searching for user: ${searchTerm}`); }}
          />
          <Button onClick={() => alert('Add New User (simulated)')}>Add User</Button>
        </div>
      </div>

      <Card style={{ padding: 'var(--spacing-lg)' }}>
        <h3 style={{ marginBottom: 'var(--spacing-md)' }}>User Accounts</h3>
        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
                <th>Last Login</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers?.map(user => (
                <tr key={user?.id} onClick={() => alert(`View details for ${user?.name} (simulated)`)}>
                  <td>{user?.name}</td>
                  <td>{user?.email}</td>
                  <td>{user?.role}</td>
                  <td><StatusBadge status={user?.status} /></td>
                  <td>{new Date(user?.lastLogin)?.toLocaleString()}</td>
                  <td className="actions" onClick={(e) => e.stopPropagation()}>
                    <Button variant="outline" size="sm" onClick={() => alert(`Edit ${user?.name} (simulated)`)}>Edit</Button>
                    <Button variant="danger" size="sm" onClick={() => alert(`Deactivate ${user?.name} (simulated)`)}>Deactivate</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </>
  );
};

const ReportsScreen = ({ navigate, currentUser }) => {
  const hasAccess = (currentUser?.role === ROLES.ADMIN || currentUser?.role === ROLES.FINANCE_TEAM || currentUser?.role === ROLES.INVENTORY_MANAGER);
  if (!hasAccess) {
    return (
      <Card>
        <h2>Access Denied</h2>
        <p>You do not have permission to view reports.</p>
        <Button onClick={() => navigate('DASHBOARD')}>Back to Dashboard</Button>
      </Card>
    );
  }

  return (
    <>
      <Breadcrumbs path={[{ label: 'Reports', onClick: () => navigate('REPORTS') }]} />
      <div className="main-content-header">
        <h1>Reports</h1>
        <div style={{ display: 'flex', gap: 'var(--spacing-md)' }}>
          <Button variant="outline" onClick={() => alert('Open filter panel for reports (simulated)')}>Filter Reports</Button>
          <Button onClick={() => alert('Generate Custom Report (simulated)')}>Generate Report</Button>
        </div>
      </div>

      <h2 style={{ marginBottom: 'var(--spacing-md)' }}>Standard Reports</h2>
      <div className="card-grid" style={{ marginBottom: 'var(--spacing-lg)' }}>
        <Card onClick={() => alert('View Stock Level Report (simulated)')}>
          <h4 style={{ marginBottom: 'var(--spacing-sm)' }}>Stock Level Report</h4>
          <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>Current inventory quantities, grouped by product or location.</p>
          <div style={{ marginTop: 'var(--spacing-md)', textAlign: 'right' }}>
            <Button variant="text">View Report</Button>
          </div>
        </Card>
        <Card onClick={() => alert('View Sales Performance Report (simulated)')}>
          <h4 style={{ marginBottom: 'var(--spacing-sm)' }}>Sales Performance</h4>
          <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>Analysis of sales trends and product performance over time.</p>
          <div style={{ marginTop: 'var(--spacing-md)', textAlign: 'right' }}>
            <Button variant="text">View Report</Button>
          </div>
        </Card>
        <Card onClick={() => alert('View Movement History Report (simulated)')}>
          <h4 style={{ marginBottom: 'var(--spacing-sm)' }}>Inventory Movement History</h4>
          <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>Detailed logs of all stock ins and outs.</p>
          <div style={{ marginTop: 'var(--spacing-md)', textAlign: 'right' }}>
            <Button variant="text">View Report</Button>
          </div>
        </Card>
        <Card onClick={() => alert('View Low Stock Alerts (simulated)')}>
          <h4 style={{ marginBottom: 'var(--spacing-sm)' }}>Low Stock & Reorder Alerts</h4>
          <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>Products nearing or below their minimum stock levels.</p>
          <div style={{ marginTop: 'var(--spacing-md)', textAlign: 'right' }}>
            <Button variant="text">View Report</Button>
          </div>
        </Card>
      </div>

      <h2 style={{ marginBottom: 'var(--spacing-md)' }}>Historical Data Visualization</h2>
      <div className="card-grid" style={{ marginBottom: 'var(--spacing-lg)' }}>
        <ChartPlaceholder title="Monthly Stock Changes" type="Bar" />
        <ChartPlaceholder title="Top 5 Selling Products" type="Bar" />
        <ChartPlaceholder title="Average Inventory Value" type="Line" />
      </div>

      <h2 style={{ marginBottom: 'var(--spacing-md)' }}>Export Options</h2>
      <Card style={{ padding: 'var(--spacing-lg)' }}>
        <p>Export current dashboard views or specific report data.</p>
        <div style={{ display: 'flex', gap: 'var(--spacing-md)' }}>
          <Button variant="outline" onClick={() => alert('Export Dashboard to PDF (simulated)')}>Export Dashboard to PDF</Button>
          <Button variant="outline" onClick={() => alert('Export Data to Excel (simulated)')}>Export Data to Excel</Button>
        </div>
      </Card>
    </>
  );
};

const SettingsScreen = ({ navigate, currentUser, changeRole }) => {
  if (currentUser?.role !== ROLES.ADMIN) {
    return (
      <Card>
        <h2>Access Denied</h2>
        <p>You do not have permission to view settings.</p>
        <Button onClick={() => navigate('DASHBOARD')}>Back to Dashboard</Button>
      </Card>
    );
  }

  const handleLogout = () => {
    // Simulate logout action
    alert('Logged out (simulated)');
    window.location.reload(); // Simple reload to reset app state
  };

  return (
    <>
      <Breadcrumbs path={[{ label: 'Settings', onClick: () => navigate('SETTINGS') }]} />
      <div className="main-content-header">
        <h1>Settings</h1>
      </div>

      <div className="card-grid">
        <Card onClick={() => alert('Manage User Roles (simulated)')}>
          <h4 style={{ marginBottom: 'var(--spacing-sm)' }}>User & Role Management</h4>
          <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>Configure user accounts, roles, and permissions.</p>
          <div style={{ marginTop: 'var(--spacing-md)', textAlign: 'right' }}>
            <Button variant="text" onClick={() => navigate('USERS')}>Go to Users</Button>
          </div>
        </Card>
        <Card onClick={() => alert('Configure Notifications (simulated)')}>
          <h4 style={{ marginBottom: 'var(--spacing-sm)' }}>Notification Settings</h4>
          <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>Set up alerts for low stock, order status changes, etc.</p>
          <div style={{ marginTop: 'var(--spacing-md)', textAlign: 'right' }}>
            <Button variant="text">Manage Notifications</Button>
          </div>
        </Card>
        <Card onClick={() => alert('View Audit Logs (simulated)')}>
          <h4 style={{ marginBottom: 'var(--spacing-sm)' }}>Audit Logs</h4>
          <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>Review immutable records of all system activities.</p>
          <div style={{ marginTop: 'var(--spacing-md)', textAlign: 'right' }}>
            <Button variant="text">View Logs</Button>
          </div>
        </Card>
        <Card onClick={() => alert('Configure Integrations (simulated)')}>
          <h4 style={{ marginBottom: 'var(--spacing-sm)' }}>Integrations</h4>
          <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>Connect with ERP, accounting, or shipping systems.</p>
          <div style={{ marginTop: 'var(--spacing-md)', textAlign: 'right' }}>
            <Button variant="text">Manage Integrations</Button>
          </div>
        </Card>
      </div>

      <div style={{ marginTop: 'var(--spacing-xl)' }}>
        <h2>Developer / Testing Tools</h2>
        <Card style={{ padding: 'var(--spacing-lg)' }}>
          <h3 style={{ marginBottom: 'var(--spacing-sm)' }}>Switch User Role</h3>
          <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>Simulate different user experiences by changing the current role.</p>
          <div className="form-group" style={{ maxWidth: '300px' }}>
            <label htmlFor="role-switcher">Current Role: <strong>{currentUser?.role}</strong></label>
            <select id="role-switcher" value={currentUser?.role} onChange={(e) => changeRole(e.target.value)}>
              {Object.values(ROLES)?.map(role => (
                <option key={role} value={role}>{role}</option>
              ))}
            </select>
          </div>
          <Button variant="danger" onClick={handleLogout} style={{ marginTop: 'var(--spacing-md)' }}>Logout</Button>
        </Card>
      </div>
    </>
  );
};

// --- Main App Component ---

function App() {
  const [view, setView] = useState({ screen: 'DASHBOARD', params: {} });
  const [currentUser, setCurrentUser] = useState(dummyUsers[0]); // Default to Admin
  const [globalSearchTerm, setGlobalSearchTerm] = useState('');

  const navigate = (screen, params = {}) => {
    setView({ screen, params });
  };

  const changeRole = (newRole) => {
    setCurrentUser(prevUser => ({ ...prevUser, role: newRole }));
    setView({ screen: 'DASHBOARD', params: {} }); // Navigate to dashboard on role change
  };

  const handleGlobalSearchSubmit = (e) => {
    e.preventDefault();
    alert(`Global search for "${globalSearchTerm}" (simulated)`);
    // In a real app, this would navigate to a global search results screen
  };

  const handleLogout = () => {
    alert('Logging out...');
    setCurrentUser(null); // Or redirect to login page
    setView({ screen: 'DASHBOARD', params: {} });
  };

  const currentScreenComponent = (() => {
    const { screen, params } = view;
    // RBAC: Check if current user has access to this screen
    const currentMenuItem = MENU_ITEMS?.find(item => item?.id === screen.split('_')[0]); // Get base screen id
    if (currentMenuItem && !currentMenuItem?.roles?.includes(currentUser?.role)) {
      return (
        <Card>
          <h2>Access Denied</h2>
          <p>Your role ({currentUser?.role}) does not have permission to view this page.</p>
          <Button onClick={() => navigate('DASHBOARD')}>Back to Dashboard</Button>
        </Card>
      );
    }

    // Render screen based on `view.screen`
    switch (screen) {
      case 'DASHBOARD':
        return <DashboardScreen navigate={navigate} currentUser={currentUser} />;
      case 'PRODUCTS':
        return <ProductListScreen navigate={navigate} initialFilterStatus={params?.status} currentUser={currentUser} />;
      case 'PRODUCT_DETAIL':
        return <ProductDetailScreen navigate={navigate} productId={params?.id} currentUser={currentUser} />;
      case 'PRODUCT_FORM':
        return <ProductFormScreen navigate={navigate} currentUser={currentUser} />;
      case 'PRODUCT_EDIT':
        return <ProductFormScreen navigate={navigate} productId={params?.id} currentUser={currentUser} />;
      case 'ORDERS':
        return <OrderListScreen navigate={navigate} initialFilterStatus={params?.status} currentUser={currentUser} />;
      case 'ORDER_DETAIL':
        return <OrderDetailScreen navigate={navigate} orderId={params?.id} currentUser={currentUser} />;
      case 'ORDER_FORM': // Not implemented fully for this example due to complexity
      case 'ORDER_EDIT':
        return (
          <Card>
            <h2>Order Form (Simulated)</h2>
            <p>Order creation/editing would involve complex line item management, customer search, etc. Not fully implemented in this single-file example. See Product Form for an example.</p>
            <Button onClick={() => navigate('ORDERS')}>Back to Orders</Button>
          </Card>
        );
      case 'SHIPMENTS':
        return <ShipmentListScreen navigate={navigate} currentUser={currentUser} />;
      case 'SHIPMENT_DETAIL':
        return <ShipmentDetailScreen navigate={navigate} shipmentId={params?.id} currentUser={currentUser} />;
      case 'SHIPMENT_FORM': // Not implemented fully
      case 'SHIPMENT_EDIT':
        return (
          <Card>
            <h2>Shipment Form (Simulated)</h2>
            <p>Shipment creation/editing would involve selecting orders, items, carriers, etc. Not fully implemented in this single-file example.</p>
            <Button onClick={() => navigate('SHIPMENTS')}>Back to Shipments</Button>
          </Card>
        );
      case 'LOCATIONS':
        return <LocationListScreen navigate={navigate} currentUser={currentUser} />;
      case 'USERS':
        return <UserListScreen navigate={navigate} currentUser={currentUser} />;
      case 'REPORTS':
        return <ReportsScreen navigate={navigate} currentUser={currentUser} />;
      case 'SETTINGS':
        return <SettingsScreen navigate={navigate} currentUser={currentUser} changeRole={changeRole} />;
      default:
        return (
          <Card>
            <h2>404 - Screen Not Found</h2>
            <p>The requested screen "{view?.screen}" does not exist.</p>
            <Button onClick={() => navigate('DASHBOARD')}>Go to Dashboard</Button>
          </Card>
        );
    }
  })();

  return (
    <div className="app-container">
      <header className="app-header">
        <div className="logo">InventoryFlow</div>
        <SearchBar
          searchTerm={globalSearchTerm}
          onSearchChange={(e) => setGlobalSearchTerm(e.target.value)}
          onSearchSubmit={handleGlobalSearchSubmit}
        />
        <div className="user-profile">
          <div className="avatar">{currentUser?.name?.charAt(0)?.toUpperCase()}</div>
          <span className="name">{currentUser?.name} ({currentUser?.role})</span>
          <Button variant="text" onClick={handleLogout}>Logout</Button>
        </div>
      </header>

      <aside className="app-sidebar">
        <nav className="sidebar-nav">
          <ul>
            {MENU_ITEMS?.filter(item => item?.roles?.includes(currentUser?.role))?.map(item => (
              <li key={item?.id}>
                <a
                  href="#"
                  className={view?.screen?.startsWith(item?.id) ? 'active' : ''}
                  onClick={() => navigate(item?.id)}
                >
                  {item?.icon} {item?.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      <main className="main-content">
        {currentScreenComponent}
      </main>
    </div>
  );
}

export default App;