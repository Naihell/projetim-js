// Budget Controller
var budgetController = (function() {

    var Expense = function(id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
        this.percentage = -1;
    };

    Expense.prototype.calcPercentage = function(totalIncome) {
        if (totalIncome > 0) {
            this.percentage = Math.round((this.value / totalIncome) * 100);
        } else {
            this.percentage = -1;
        }
    };

    Expense.prototype.getPercentage = function() {
        return this.percentage;
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
        }, 
        budget: 0,
        // Means that something is nonexistent
        percentage: -1
    };

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

        deleteItem: function(type, id) {

            var ids, index;
            
            ids = data.allItens[type].map(function(current) {
                return current.id
            });

            index = ids.indexOf(id);

            if(index !== -1) {
                data.allItens[type].slice(index, 1);
            }

        },

        calculateBudget: function() {

            calculateTotal('exp');
            calculateTotal('inc');

            data.budget = data.totals.inc - data.totals.exp;

            if(data.totals.inc > 0){
                data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
            } else {
                data.percentage = -1;
            }
        },

        calculatePercentages: function() {
            data.allItens.exp.forEach(function(cur) {
                cur.calcPercentage(data.totals.inc);
            });
        },

        getPercentages: function() {
            var allPerc = data.allItens.exp.map(function(cur) {
                return cur.getPercentage();
            });
            return allPerc;
        },

        getBudget: function() {
            return {
                budget: data.budget,
                totalInc: data.totals.inc,
                totalExp: data.totals.exp,
                percentage: data.percentage
            };
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
        expensesContainer: '.expenses__list',
        budgetLabel: '.budget__value',
        incomeLabel: '.budget__income--value',
        expensesLabel: '.budget__expenses--value',
        percentageLabel: '.budget__expenses--percentage',
        container: '.container',
        expensesPercLabel: '.item__percentage'
    };

    var formatNumber = function(num, type) {
        var numSplit, int, dec, type;
        // Remove os sinais 
        num = Math.abs(num);
        // Define a quantidade de casos decimais
        num = num.toFixed(2);
        numSplit = num.split('.');
        int = numSplit[0];

        if(int.length > 3) {
            int = int.substr(0, int.length - 3) + ',' + int.substr(int.length - 3, int.length);
            // Deixa como algo: 66,666
        }

        dec = numSplit[1];
        
        return (type === 'exp' ? '-' : '+')  + ' ' + int + '.' + dec;
    };

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
                html = '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            } else if(type === 'exp') {
                element = DOMstrings.expensesContainer;
                html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            }
            
            newHtml = html.replace('%id%', obj.id);
            newHtml = newHtml.replace('%description%', obj.description);
            newHtml = newHtml.replace('%value%',  formatNumber(obj.value, type));

            document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
        },

        deleteListItem: function(selectorID) {

            var el = document.getElementById(selectorID);
            el.parentNode.removeChild(el);
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

        displayBudget: function(obj) {
            var type;

            obj.budget > 0 ? type = 'inc' : type = 'exp';

            document.querySelector(DOMstrings.budgetLabel).textContent = formatNumber(obj.budget, type);
            document.querySelector(DOMstrings.incomeLabel).textContent = formatNumber(obj.totalInc, 'inc');
            document.querySelector(DOMstrings.expensesLabel).textContent = formatNumber(obj.totalExp, 'exp');
            

            if(obj.percentage > 0) {
                document.querySelector(DOMstrings.percentageLabel).textContent = obj.percentage + '%';
            } else {
                document.querySelector(DOMstrings.percentageLabel).textContent = '---';
            }
        },

        displayPercentages: function(percentages) {

            var fields = document.querySelectorAll(DOMstrings.expensesPercLabel);

            var nodeListForEach = function(list, callback) {
                for(var i = 0; i < list.length; i++) {
                    callback(list[i], i);
                }
            };

            nodeListForEach(fields, function(current, index) {
                if(percentages[index] > 0) {
                    current.textContent = percentages[index] + '%';
                } else {
                    current.textContent = '---';
                }
                
            });
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

        document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem);
    };

    var updateBudget = function() {
        
        budgetController.calculateBudget();

        var budget = budgetCtrl.getBudget();

        UICtrl.displayBudget(budget);
    };

    var updatePercentages = function() {

        // Calcular os percentuais
        budgetCtrl.calculatePercentages();
        // Ler os percentuais da controller
        var percentages = budgetCtrl.getPercentages();
        // Atualizar a UI com os novos valores
        UIController.displayPercentages(percentages);
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

            // Atualizo os percentuais
            updatePercentages();
        }
    };

    var ctrlDeleteItem = function() {
        var itemID, splitID, type, ID;
        itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;

        if(itemID) {

            // inc-i
            splitID = itemID.split('-');
            type = splitID[0];
            ID = parseInt(splitID[1]);

            // deletar o item da estrutura de dados
            budgetCtrl.deleteItem(type, ID);
            // deletar o item da interface
            UIController.deleteListItem(itemID);
            // atualizar e retornar as despesas
            updateBudget();
            // atualizo os percentuais
            updatePercentages();

        }
    };

    return {
        init: function() {
            console.log('Startado!');
            UIController.displayBudget({
                budget: 0,
                totalInc: 0,
                totalExp: 0,
                percentage: -1
            });
            setupEventListeners();
        }
    };

})(budgetController, UIController);

controller.init();