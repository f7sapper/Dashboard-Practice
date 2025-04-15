// Define the Angular module for the dashboard application
var app = angular.module('dashboardApp', []);

// Define the controller that will manage the dashboard data and functionality
app.controller('DashboardController', function($scope, $http, $interval) {
    // Initialize dashboard data
    $scope.lastUpdated = new Date();

    // Initialize stores array
    $scope.stores = [];
    $scope.selectedStore = 'all';
    
    // Initialize date range with default of last 30 days
    $scope.dateRange = {
        start: new Date(new Date().setDate(new Date().getDate() - 30)),
        end: new Date()
    };
    
    // Load stores from text file
    $scope.loadStores = function() {
        $http.get('stores.txt')
            .then(function(response) {
                // Parse the text file - assuming each line is a store number
                var storeLines = response.data.split('\n');
                $scope.stores = storeLines.map(function(line) {
                    // Remove any whitespace and create store object
                    var storeId = line.trim();
                    if (storeId) {
                        return { id: storeId };
                    }
                }).filter(Boolean); // Filter out any undefined entries
            })
            .catch(function(error) {
                console.error('Error loading stores:', error);
                // Fallback to a few sample stores if file can't be loaded
                $scope.stores = [
                    { id: '1001' },
                    { id: '1002' },
                    { id: '1003' },
                    { id: '2001' }
                ];
            });
    };
    
    // Filter data based on selected store and date range
    $scope.filterData = function() {
        console.log('Filtering for store:', $scope.selectedStore);
        console.log('Date range:', $scope.dateRange.start, 'to', $scope.dateRange.end);
        
        // Generate filtered data
        $scope.fetchFilteredData();
    };
    
    // Reset filters to default values
    $scope.resetFilters = function() {
        $scope.selectedStore = 'all';
        $scope.dateRange = {
            start: new Date(new Date().setDate(new Date().getDate() - 30)),
            end: new Date()
        };
        $scope.filterData();
    };
    
    // Function to fetch filtered data
    $scope.fetchFilteredData = function() {
        // In a real application, you would pass the store and date parameters to your API
        // For this demo, the mock data is modified based on filters

            
        let data = getMockData();
        
        // Apply store filter logic (simulate different data for different stores)
        if ($scope.selectedStore !== 'all') {
            // Use the store number to seed a consistent random factor for that store
            let storeNum = parseInt($scope.selectedStore);
            let storeFactor = ((storeNum % 10) + 5) / 10; // Generate a factor between 0.5 and 1.4
            
            // Adjust metrics by store factor
            data.metrics.totalSales *= storeFactor;
            data.metrics.totalOrders *= storeFactor;
            data.metrics.totalCustomers *= storeFactor;
            data.metrics.avgOrderValue = data.metrics.totalSales / data.metrics.totalOrders;
            
            // Adjust sales data
            for (let i = 0; i < data.salesData.data.length; i++) {
                data.salesData.data[i] *= storeFactor;
            }
            
            // Adjust product data
            for (let i = 0; i < data.productData.data.length; i++) {
                data.productData.data[i] *= storeFactor;
            }
            
            // Filter orders to simulate store-specific orders
            data.recentOrders = data.recentOrders.filter((_, idx) => idx % 3 === storeNum % 3);
        }
        
        // Apply date filter (in a real app, this would be done on the server)
        // For now, we just note that the filter was applied
        if ($scope.dateRange.start && $scope.dateRange.end) {
            console.log("Date filter applied:", $scope.dateRange.start, "to", $scope.dateRange.end);
            // In a real app: filter data to include only items within date range
        }
        
        // Update the dashboard with our filtered data
        $scope.updateDashboard(data);
        $scope.lastUpdated = new Date();
    };
    
    // Key metrics object
    $scope.metrics = {
        totalSales: 0,
        salesTrend: 0,
        totalOrders: 0,
        ordersTrend: 0,
        totalCustomers: 0,
        customersTrend: 0,
        avgOrderValue: 0,
        aovTrend: 0
    };
    
    $scope.recentOrders = [];
    
    // Function to fetch data from API
    $scope.fetchData = function() {
        // In a real application, replace this URL with actual API endpoint
        // $http.get('https://your-api-endpoint.com/dashboard-data')
        //     .then(function(response) {
        //         // Update dashboard with real data
        //         $scope.updateDashboard(response.data);
        //     })
        //     .catch(function(error) {
        //         console.error('Error fetching data:', error);
        //     });
        
        // For demonstration purposes, this line is generating random mock data
        $scope.updateDashboard(getMockData());
        $scope.lastUpdated = new Date();
    };
    
    // Function to manually refresh data
    $scope.refreshData = function() {
        $scope.fetchData();
    };
    
    // Update the dashboard with data (whether from API or mock)
    $scope.updateDashboard = function(data) {
        // Update metrics
        $scope.metrics = data.metrics;
        $scope.recentOrders = data.recentOrders;
        
        // Update charts
        updateSalesChart(data.salesData);
        updateProductsChart(data.productData);
    };
    
    // Function to generate mock data (replace with actual API integration)
    // In a real application, this function would not be needed
    // and the data would come from the API
    function getMockData() {
        return {
            metrics: {
                totalSales: Math.floor(Math.random() * 50000) + 10000, // Random number between 10,000 and 60,000
                salesTrend: Math.floor(Math.random() * 40) - 20,       // Random number between -20% to 20%
                totalOrders: Math.floor(Math.random() * 500) + 100,    // Random number between 100 and 600
                ordersTrend: Math.floor(Math.random() * 30) - 15,      // Random between -15% and +15%
                totalCustomers: Math.floor(Math.random() * 300) + 50,  // Random number between 50 and 350
                customersTrend: Math.floor(Math.random() * 25) - 10,   // Random between -10% and 15%
                avgOrderValue: Math.floor(Math.random() * 100) + 50,   // Random number between $50 and $150
                aovTrend: Math.floor(Math.random() * 20) - 10          // Random between -10% and 10%
            },

            // Sales chart data - fixed months but random values
            // In a real application, this data would come from the API
            // and would be dynamic based on actual sales data
            salesData: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                data: [
                    Math.floor(Math.random() * 10000) + 5000,
                    Math.floor(Math.random() * 10000) + 5000,
                    Math.floor(Math.random() * 10000) + 5000,
                    Math.floor(Math.random() * 10000) + 5000,
                    Math.floor(Math.random() * 10000) + 5000,
                    Math.floor(Math.random() * 10000) + 5000
                ]
            },

            // Product chart data - fixed product names but random values
            // In a real application, this data would come from the API
            // and would be dynamic based on actual product sales
            productData: {
                labels: ['Product A', 'Product B', 'Product C', 'Product D', 'Product E'],
                data: [
                    // Five random values between 100 and 600
                    Math.floor(Math.random() * 500) + 100,
                    Math.floor(Math.random() * 500) + 100,
                    Math.floor(Math.random() * 500) + 100,
                    Math.floor(Math.random() * 500) + 100,
                    Math.floor(Math.random() * 500) + 100
                ]
            },
            // Recent orders - calls helper function to generate 10 orders
            recentOrders: generateMockOrders(10)
        };
    }
    
        // Generate mock orders for demo purposes
        function generateMockOrders(count) {
         var orders = [];
         var statuses = ['Completed', 'Processing', 'Cancelled'];
         for (var i = 0; i < count; i++) {
            orders.push({
               id: 'ORD-' + (1000 + i),          // Creates IDs like ORD-1000, ORD-1001
                customer: 'Customer ' + (i + 1),  // Creates names like Customer 1, Customer 2
                date: new Date(Date.now() - Math.floor(Math.random() * 10) * 86400000),  // Random date within last 10 days
                amount: Math.floor(Math.random() * 500) + 50,                            // Random amount between $50 and $550
                status: statuses[Math.floor(Math.random() * statuses.length)]            // Random status from the array
            });
        }
        return orders;
     }
 
    // Chart rendering functions
    var salesChart, productsChart;

    function updateSalesChart(salesData) {
        var ctx = document.getElementById('salesChart').getContext('2d');
        
        // Destroy existing chart if it exists
        if (salesChart) {
            salesChart.destroy();
        }
        
        salesChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: salesData.labels,
                datasets: [{
                    label: 'Sales ($)',
                    data: salesData.data,
                    borderColor: 'rgba(75, 192, 192, 1)',
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    tension: 0.1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false
            }
        });
    }
    
    function updateProductsChart(productData) {
        var ctx = document.getElementById('productsChart').getContext('2d');

        // Destroy existing chart if it exists
        if (productsChart) {
            productsChart.destroy();
        }

        productsChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: productData.labels,
                datasets: [{
                    label: 'Units Sold',
                    data: productData.data,
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.5)',
                        'rgba(54, 162, 235, 0.5)',
                        'rgba(255, 206, 86, 0.5)',
                        'rgba(75, 192, 192, 0.5)',
                        'rgba(153, 102, 255, 0.5)'
                    ],
                    borderColor: [
                        'rgba(255, 99, 132, 1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(75, 192, 192, 1)',
                        'rgba(153, 102, 255, 1)'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero: true
                        }
                    }]
                }
            }
        });
    }
    
    // Initial data load
    $scope.fetchData();
    
    // Set up auto-refresh every 5 minutes (300000 ms)
    // In a real application, you might want to adjust this interval
    var autoRefresh = $interval($scope.fetchData, 300000);
    
    // Clean up the interval when the controller is destroyed
    $scope.$on('$destroy', function() {
        if (autoRefresh) {
            $interval.cancel(autoRefresh);
        }
    });
});