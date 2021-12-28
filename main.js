const currencyStr = 'CHF, NOK, CAD, MXN, CNY, ISK, KRW, HKD, CZK, BGN, BRL, IDR, SGD, PHP, RON, HUF, ILS, THB, SEK, NZD, AUD, DKK, HRK, PLN, TRY, INR, MYR, ZAR, JPY';

window.addEventListener('load', () => init());

function init() {
    const currencyArr = currencyStr.split(', ');

    const blocks = [];

    function serverRequest(id) {
        API.request(blocks[0].value, blocks[1].value, response, id);
    }

    function response(rates, id) {
        console.log(id)
        console.log(rates)
        if (id === 1) {
            blocks[1].inputField.value = blocks[0].inputField.value * rates[blocks[1].value];
        } else if (id === 2) {
            blocks[0].inputField.value = blocks[1].inputField.value / rates[blocks[1].value];
        }
        document.querySelector('.calc1').innerText = `1 ${blocks[0].value} = ${rates[blocks[1].value]} ${blocks[1].value}`;
        document.querySelector('.calc2').innerText = `1 ${blocks[1].value} = ${1 / rates[blocks[1].value]} ${blocks[0].value}`;
    }

    ['RUB', 'USD'].forEach((currency, index) => {
        const currencyInput = new CurrencyInput(index + 1, currencyArr, currency, serverRequest);
        blocks.push(currencyInput);
    });

    serverRequest();

    document.querySelector('.btn-convert').addEventListener('click', () => {
        const bv0 = blocks[0].value;
        const bv1 = blocks[1].value;
        blocks[0].reverseBtn(bv1);
        blocks[1].reverseBtn(bv0);
        serverRequest(1);
    });
};

class CurrencyInput {
    constructor(inputId, currencyList, defaultValue, callback) {
        this.value = defaultValue;
        this.inputField = document.querySelector(`#input${inputId}`);
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
        this.container = block;
        this.btns = btns;
        this.select = select;
    };
    reverseBtn(value) {
        this.container.querySelector('.selected').classList.remove('selected');
        const btn = [...this.btns].find((btn) => btn.innerText === value);
        if (btn) {
            btn.classList.add('selected');
        } else {
            const options = this.container.querySelectorAll('option');
            const option = [...options].find((option) => option.value === value);
            option.selected = true;
            this.select.classList.add('selected');
        };
        this.value = value;
    };
};

const API = {
    request(base, symbols, responseCallback, id) {
        const timer = setTimeout(() => {
            document.querySelector('.loader').classList.add('active');
        }, 500);
        fetch(`https://api.exchangerate.host/latest?base=${base}&symbols=${symbols}`)
            .then(res => res.json())
            .then(data => {
                clearTimeout(timer);
                responseCallback(data.rates, id)
            })
            .catch(err => {
                clearTimeout(timer);
                document.querySelector('.error').classList.add('active');
            });
    }
};