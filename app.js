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

    var calculateTotal = function(type) {
        var sum = 0;
        data.allItens[type].forEach(function(cur) {
            sum += cur.value;
        });
        data.totals[type] = sum;
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

        calculateBudget: function() {

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
        inputBtn: '.add__btn',
        incomeContainer: '.income__list',
        expensesContainer: '.expenses__list'
    }
    return {
        getInput: function() {
            return {
                type: document.querySelector(DOMstrings.inputType).value, // Pode ser o inc ou exp
                description: document.querySelector(DOMstrings.inputDescription).value,
                value: parseFloat(document.querySelector(DOMstrings.inputValue).value)
            };
        },

        addListItem: function(obj, type) {
            var html, newHtml, element;
            // Crio uma string de html com um placeholder
            if(type === 'inc') {
                element = DOMstrings.incomeContainer;
                html = '<div class="item clearfix" id="income-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            } else if(type === 'exp') {
                element = DOMstrings.expensesContainer;
                html = '<div class="item clearfix" id="expense-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            }
            
            newHtml = html.replace('%id%', obj.id);
            newHtml = newHtml.replace('%description%', obj.description);
            newHtml = newHtml.replace('%value%', obj.value);

            document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
        },

        clearFields: function() {
            var fields, fieldsArr;

            fields = document.querySelectorAll(DOMstrings.inputDescription + ', ' 
            + DOMstrings.inputValue);

            // Converto uma lista num array.
            fieldsArr = Array.prototype.slice.call(fields);

            fieldsArr.forEach(function(current, index, array) {
                current.value = "";
            });
            fieldsArr[0].focus();
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

    var updateBudget = function() {

    };

    var ctrlAddItem = function() {
        var input, newItem;

        // Recebe os valores do campo data
        input = UIController.getInput();

        if(input.description !== "" && !isNaN(input.value) && input.value > 0) {
            // Adiciona o item a controller budget
            newItem = budgetController.addItem(input.type, input.description, input.value);
    
            // Retorno o newItem na interface
            UIController.addListItem(newItem, input.type);
    
            // Limpo os campos com os valores informados
            UIController.clearFields();
    
            // Calculo e atualizo os valores
            updateBudget();
        }
    };

    return {
        init: function() {
            console.log('Startado!');
            setupEventListeners();
        }
    };

})(budgetController, UIController);

controller.init();