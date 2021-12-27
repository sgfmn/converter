const currencyStr = 'EUR, CHF, NOK, CAD, RUB, GBP, MXN, CNY, ISK, KRW, HKD, CZK, BGN, BRL, USD, IDR, SGD, PHP, RON, HUF, ILS, THB, SEK, NZD, AUD, DKK, HRK, PLN, TRY, INR, MYR, ZAR, JPY';

window.addEventListener('load', () => init());

function init() {
    const currencyArr = currencyStr.split(', ');

    const blocks = [];

    function request(id) {
        API.request(blocks[0].value, blocks[1].value, response, id);
    }

    function response(rates, id) {
        console.log(id)
        console.log(rates)
        if (id === 1) {
            blocks[1].inputFild.value = blocks[0].inputFild.value * rates[blocks[1].value];
        } else if (id === 2) {
            blocks[0].inputFild.value = blocks[1].inputFild.value / rates[blocks[1].value];
        }
    }

    ['RUB', 'USD'].forEach((currency, index) => {
        const currencyInput = new CurrencyInput(index + 1, currencyArr, currency, request);
        blocks.push(currencyInput);
    });
};

class CurrencyInput {
    constructor(inputId, currencyList, defaultValue, callback) {
        this.value = defaultValue;
        this.inputFild = document.querySelector(`#input${inputId}`);
        this.input = 0;
        const block = document.querySelector(`#block-${inputId}`);

        block.querySelector('input').addEventListener('change', (event) => {
            this.input = event.target.value;
            callback(inputId);
        })

        const select = block.querySelector('select');
        const btns = block.querySelectorAll('.btn:not(select)');
        select.addEventListener('change', () => {
            this.value = select.value;
            callback(inputId);
        })

        select.addEventListener('change', () => {
            this.value = select.value;
            block.querySelector('.selected').classList.remove("selected");
            select.classList.add("selected");
            callback(inputId);
        })

        btns.forEach(btn => {
            btn.addEventListener("click", () => {
                block.querySelector(".selected").classList.remove("selected");
                btn.classList.add('selected');
                this.value = btn.innerText;
                callback(inputId);
            });
        });

        currencyList.forEach(currencyText => {
            const option = document.createElement('option');
            option.value = currencyText;
            option.innerText = currencyText;
            select.append(option);
        });
    }
};

const API = {
    request(base, symbols, callback, id) {
        fetch(`https://api.exchangerate.host/latest?base=${base}&symbols=${symbols}`)
            .then(res => res.json())
            .then(data => {
                callback(data.rates, id)
            })
    }
};