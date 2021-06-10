pragma solidity 0.5.16;


contract Factory {
    // Model a Candidate
    struct Product {
        uint id;
        string name;
        string Defect_type;
    }

    // Read/write candidates
    mapping(uint => Product) public Defective_Products;
    // Store Candidates Count
    uint public ProductCount;

    constructor() public {
        addDefectiveProduct("Product 1", "d");
        addDefectiveProduct("Product 2", "a");
        addDefectiveProduct("Product 3", "b");
    }

    function addDefectiveProduct (string memory _name, string memory _Defect_type) public {
        ProductCount++;
        Defective_Products[ProductCount] = Product(ProductCount, _name, _Defect_type);
    }

}
