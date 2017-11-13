// Budget Controller
var budgetController = (function() {

    var Expense = function(id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    };

    var Income = function(id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    };

    var data = {
        allItens: {
            exp: [],
            inc: []
        },
        totals: {
            exp: 0,
            inc: 0
        }
    }

    return {
        addItem: function(type, des, val) {
            var newItem, ID;
            // Cria um novo id
            if (data.allItens[type].length > 0) {
                ID = data.allItens[type][data.allItens[type].length - 1].id + 1;
            } else {
                ID = 0;
            }
             // Cria um novo id baseado no type inc ou exp
            if(type === 'exp') {
                newItem = new Expense(ID, des, val);
            } else if (type === 'inc') {
                newItem = new Income(ID, des, val);
            }
            // Adiciona o novo item
            data.allItens[type].push(newItem);
            return newItem;
        },

        testing: function() {
            console.log(data);
        }
    };

})();

// UI Controller
var UIController = (function() {
    
    var DOMstrings = {
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        inputBtn: '.add__btn'
    }
    return {
        getInput: function() {
            return {
                type: document.querySelector(DOMstrings.inputType).value, // Pode ser o inc ou exp
                description: document.querySelector(DOMstrings.inputDescription).value,
                value: document.querySelector(DOMstrings.inputValue).value
            };
        },

        addListItem: function(obj, type) {
            
        },

        getDOMstrings: function() {
            return DOMstrings;
        }
    };
})();

// Global app controller
var controller = (function(budgetCtrl, UICtrl) { 

    var setupEventListeners = function() {
        var DOM = UIController.getDOMstrings();
        document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem);
        document.addEventListener('keypress', function(event) {
            // Alguns navegadores antigos nao reconhecem o keycode, nesse caso utiliza-se o which
            if(event.keyCode === 13 || event.which === 13) {
                ctrlAddItem();
            }
        });
    };
    
    var ctrlAddItem = function() {
        var input, newItem;

        // Recebe os valores do campo data
        input = UIController.getInput();

        // Adiciona o item a controller budget
        newItem = budgetController.addItem(input.type, input.description, input.value);
    };

    return {
        init: function() {
            console.log('Startado!');
            setupEventListeners();
        }
    };

})(budgetController, UIController);

controller.init();