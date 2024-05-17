import React, { useEffect, useState, useRef } from "react";
import { connect, useDispatch, useSelector } from "react-redux";
import { Card, Button as AntButton, Table, Popconfirm, Pagination, Modal, Input, Checkbox, Form, Select, Space, Typography } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import Highlighter from 'react-highlight-words';
import { CreateProduct, GetAllProducts, GetProductbycode, RemoveProduct, UpdateProduct } from "../Redux/ActionCreater";
import { OpenPopup } from "../Redux/Action";

const { Option } = Select;
const { Title } = Typography;

const Product = (props) => {
  // Function to generate a random ID
  const generateRandomId = () => {
    const randomId = Math.floor(Math.random() * 900 + 100); // Generates a random number between 100 and 999
    return String(randomId);
  };
  
  // State variables
  const [searchText, setSearchText] = useState(''); // State for search text
  const [searchedColumn, setSearchedColumn] = useState(''); // State for searched column
  const searchInput = useRef(null); // Ref for search input field
  const dispatch = useDispatch(); // Redux dispatch function

  // State variables for product details
  const [id, idchange] = useState(generateRandomId()); // State for product ID
  const [product, productchange] = useState(''); // State for product name
  const [instock, instockchange] = useState(true); // State for product availability
  const [price, pricechange] = useState(''); // State for product price
  const [description, descriptionchange] = useState('none'); // State for product description
  const [category, categorychange] = useState('Grocery'); // State for product category
  const [open, openchange] = useState(false); // State for modal visibility
  const [agreeterm, agreetermchange] = useState(true); // State for agreement to terms
  const [rowPerPage, setRowPerPage] = useState(5); // State for rows per page in table
  const [page, setPage] = useState(0); // State for current page number
  const [isEdit, iseditchange] = useState(false); // State for editing mode
  const [title, titlechange] = useState('Create Product'); // State for modal title

  // Function to handle search
  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  // Function to reset search filters
  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText('');
  };

  // Function to get column search properties
  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
      <div style={{ padding: 8 }}>
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{ width: 188, marginBottom: 8, display: 'block' }}
        />
        <Space>
          <AntButton
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Search
          </AntButton>
          <AntButton onClick={() => handleReset(clearFilters)} size="small" style={{ width: 90 }}>
            Reset
          </AntButton>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,
    onFilter: (value, record) => record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
    onFilterDropdownVisibleChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current.select(), 100);
      }
    },
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text.toString()}
        />
      ) : (
        text
      ),
  });

  // Columns configuration for the table
  const columns = [
    { title: 'Id', dataIndex: 'id', key: 'id' },
    { title: 'Product', dataIndex: 'product', key: 'product', ...getColumnSearchProps('product') },
    { 
      title: 'In Stock', 
      dataIndex: 'instock', 
      key: 'instock', 
      render: (instock) => (instock ? 'Yes' : 'No'), // Custom rendering for boolean value
    },
    {
      title: 'Price', dataIndex: 'price', key: 'price',
      sorter: (record1, record2) => parseFloat(record1.price) - parseFloat(record2.price),
    },
    { title: 'Description', dataIndex: 'description', key: 'description', ...getColumnSearchProps('description') },
    {
      title: 'Category', dataIndex: 'category', key: 'category',
      render: (category) => {
        let color;
        switch (category) {
          case 'Fashion':
            color = 'blue';
            break;
          case 'Grocery':
            color = 'green';
            break;
          default:
            color = 'black';
        }
        return <span style={{ color }}>{category}</span>;
      },
      filters: [
        { text: 'Electronics', value: 'electronics' },
        { text: 'Cosmetics', value: 'cosmetics' },
        { text: 'Fashion', value: 'Fashion' },
        { text: 'Grocery', value: 'Grocery' },
      ],
      onFilter: (value, record) => record.category === value
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <span>
          <AntButton
            onClick={() => handleEdit(record.id)}
            type="primary"
            style={{ marginRight: 8 }}
          >
            Edit
          </AntButton>
          <Popconfirm
            title="Are you sure to delete this Product"
            onConfirm={() => handleRemove(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <AntButton type="danger">Delete</AntButton>
          </Popconfirm>
        </span>
      ),
    },
  ];

  // Function to handle edit object changes
  const editobj = useSelector((state) => state.companyProducts.productobj);

  useEffect(() => {
    if (editobj && Object.keys(editobj).length > 0) {
      idchange(editobj.id);
      productchange(editobj.product);
      instockchange(editobj.instock);
      pricechange(editobj.price);
      descriptionchange(editobj.description);
      categorychange(editobj.category);
    } else {
      clearstate();
    }
  }, [editobj]);

  // Function to handle page change
  const handlePageChange = (newPage) => {
    setPage(newPage - 1);
  };

  // Function to handle rows per page change
  const handleRowPerPageChange = (current, size) => {
    setRowPerPage(size);
    setPage(0);
  };

  // Function to add a new product
  const functionAdd = () => {
    iseditchange(false);
    titlechange('Create Product');
    openPopup();
  };

  // Function to close the modal
  const closePopup = () => {
    openchange(false);
  };

  // Function to open the modal for adding/editing product
  const openPopup = () => {
    clearstate();
    openchange(true);
    dispatch(OpenPopup());
  };

  // Function to handle form submission
  const handleSubmit = (values) => {
    const { product, instock, price, description, category } = values;
    const productObj = { id, product, instock, price, Description: description, category };
    if (isEdit) {
      dispatch(UpdateProduct(productObj));
    } else {
      dispatch(CreateProduct(productObj));
    }
    closePopup();
  };

  // Function to handle editing a product
  const handleEdit = (code) => {
    iseditchange(true);
    titlechange('Update Product');
    openchange(true);
    dispatch(GetProductbycode(code));
  };

  // Function to handle product removal
  const handleRemove = (code) => {
    dispatch(RemoveProduct(code));
  };

  // Function to clear product state
  const clearstate = () => {
    idchange(0);
    productchange('');
    instockchange(true);
    pricechange('');
    descriptionchange('none');
    categorychange('Grocery');
  };

  // Fetch product data when component mounts
  useEffect(() => {
    props.loadProduct();
  }, []);

  // Destructuring props
  const { productlist, isLoading, errorMessage } = props.productState;

  return (
    isLoading ? <div><h2>Loading.....</h2></div> :
      errorMessage ? <div><h2>{errorMessage}</h2></div> :
      <div style={{ maxWidth: "1200px", margin: '0 auto' }}>
        <div style={{ textAlign: 'center', margin: '2rem 0' }}>
          <Title level={1} style={{ color: '#1890ff', marginBottom: '0.5rem' }}>
            Product Management
          </Title>
          <Title level={3} style={{ color: '#999', margin: 0 }}>
            Application
          </Title>
        </div>
        <div style={{ margin: '1%' }}>
          Total Products: {productlist ? productlist.length : 0}
        </div>
        <Card style={{ margin: '16px', flex: 1 }}>
          <div style={{ margin: '1%' }}>
            <AntButton onClick={functionAdd} type="primary">Add New (+)</AntButton>
          </div>
          <div style={{ margin: '1%' }}>
            <Table
              dataSource={productlist ? productlist.slice(page * rowPerPage, (page + 1) * rowPerPage) : []}
              columns={columns}
              rowKey="id"
              pagination={false}
            />
            <Pagination
              style={{ marginTop: '16px', textAlign: 'right' }}
              current={page + 1}
              total={productlist ? productlist.length : 0}
              pageSize={rowPerPage}
              onShowSizeChange={handleRowPerPageChange}
              onChange={handlePageChange}
            />
          </div>
        </Card>
        <Modal
          title={title}
          visible={open}
          onCancel={closePopup}
          footer={null}
        >
          <Form layout="vertical" onFinish={handleSubmit} initialValues={{ product, instock, price, description, category }}>
            <Form.Item label="Product" name="product" rules={[{ required: true, message: 'Please input the product name!' }]}>
              <Input />
            </Form.Item>
            <Form.Item label="In Stock" name="instock" valuePropName="checked">
              <Checkbox checked={instock} onChange={(e) => instockchange(e.target.checked)} />
            </Form.Item>
            <Form.Item label="Price" name="price" rules={[{ required: true, message: 'Please input the price!' }]}>
              <Input />
            </Form.Item>
            <Form.Item label="Description" name="description">
              <Input.TextArea rows={2} />
            </Form.Item>
            <Form.Item label="Category" name="category">
              <Select>
                <Option value="electronics">electronics</Option>
                <Option value="Fashion">Fashion</Option>
                <Option value="Grocery">Grocery</Option>
                <Option value="cosmetics">cosmetics</Option>
              </Select>
            </Form.Item>
            <Form.Item name="agreeterm" valuePropName="checked">
              <Checkbox checked={agreeterm} onChange={e => agreetermchange(e.target.checked)}>
                Agree Terms & Conditions
              </Checkbox>
            </Form.Item>
            <Form.Item>
              <AntButton type="primary" htmlType="submit" disabled={!agreeterm}>
                Submit
              </AntButton>
            </Form.Item>
          </Form>
        </Modal>
      </div>
  );
};

// Mapping state to props
const mapStateToProps = (state) => {
  return {
    productState: state.companyProducts
  };
};

// Mapping dispatch to props
const mapDispatchToProps = (dispatch) => {
  return {
    loadProduct: () => dispatch(GetAllProducts())
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Product);

