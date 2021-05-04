# Getnet SDK - JS
SDK JS to Getnet

## Documentation
 - API Reference - [https://api.getnet.com.br/v1/doc/api](https://api.getnet.com.br/v1/doc/api)

 ## Operações de crédito

 **Exemplo de uso**:

  ```javascript
    const { Getnet, Envs } = require('getnet-sdk-js');

    var trans = {
        //.... conforme o objeto DA TRANSAÇÃO EXEMPLIFICADO ABAIXO
    };

    const getnet = new Getnet(client_id, client_secret, Envs.EV_SANDBOX);


    // Autorizar transacao de credito
    var trans = await getnet.authorizeCredit(trans);

    // Para CONFIRMAR uma autorização tardia
    if (trans.status == 'AUTHORIZED') {
        await getnet.confirmCredit(trans.payment_id);
    }    

    // Para CANCELAR uma autorização tardia
    if (trans.status == 'AUTHORIZED') {
        await getnet.cancelCredit(trans.payment_id);
    }   

 ```


 ### Solicitar autorização de transação de crédito

 **Requisição**:
 ```json
    {
        "seller_id": "d2d87a25-194d-4fbe-b3f1-bdd33712e51a",
        "amount": 9850,
        "currency": "BRL",
        "order": {
            "order_id": "654",
            "product_type": "service"
        },
        "customer": {
            "customer_id": "654",
            "name": "Fulano de Teste",
            "email": "teste@teste.com.br",
            "document_type": "CPF",
            "document_number": "12345678912",
            "phone_number": "5548999991010",
            "billing_address": {
                "street": "Rua de Teste",
                "number": "100",
                "complement": "Sala 1",
                "district": "Centro",
                "city": "São Paulo",
                "state": "SP",
                "country": "Brasil",
                "postal_code": "88040000"
            }
        },
        "credit": {
            "authenticated": false,
            "delayed": true,
            "transaction_type": "FULL",
            "number_installments": 1,
            "soft_descriptor": "TESTE",
            "save_card_data": false,
            "pre_authorization": false,
            "card": {
                "number_card": "5155901222280001",
                "cardholder_name": "Fulano de Teste",
                "security_code": "123",
                "brand": "Visa",
                "expiration_month": "12",
                "expiration_year": "25"

            }
        }
    }
 ```

 **Resposta**:

 ```json
{
  "payment_id": "e445875f-1d51-4c21-8516-56b76b4726e1",
  "seller_id": "d2d87a25-194d-4fbe-b3f1-bdd337126584",
  "amount": 100,
  "currency": "BRL",
  "order_id": "123",
  "status": "AUTHORIZED",
  "received_at": "2021-05-04T02:46:41.148Z",
  "credit": {
    "delayed": true,
    "authorization_code": "568860856717",
    "authorized_at": "2021-05-04T02:46:41.148Z",
    "reason_code": "0",
    "reason_message": "transaction approved",
    "acquirer": "GETNET",
    "soft_descriptor": "EC*SANDBOX",
    "terminal_nsu": "616399",
    "brand": "Visa",
    "acquirer_transaction_id": "12438859",
    "transaction_id": "9969879755693138"
  }
} 
 ```

 ### Confirmação de uma autorização tardia

 Quando for solicitado uma autorização de transação com confirmação tardia e o status da transação for **AUTHORIZED**, deverá ser confirmado essa transação usando o metodo **confirmCredit**.

 **Resposta**:

 ```json
 {
     "payment_id": "e445875f-1d51-4c21-8516-56b76b4726e1",
     "seller_id": "d2d87a25-194d-4fbe-b3f1-bdd33712548754",
     "amount": 100,
     "currency": "BRL",
     "order_id": "123",
     "status": "CONFIRMED",
     "credit_confirm": {
     "confirm_date": "2021-05-04T02:48:39.151Z",
     "message": "Postponed e4de135f-1d51-4c21-8516-56b76b4726e1 confirmed"
  }
}
 ```

 ### Cancelamento de uma trasação tardia

Quando for solicitado for necessario cancelar a ultima transacao, deverá ser utilizado o método **cancelCredit**.

**Resposta**:

```json
{
    "payment_id": "e445875f-1d51-4c21-8516-56b76b4726e1",
    "seller_id": "d2d87a25-194d-4fbe-b3f1-bdd337654",
    "amount": 100,
    "currency": "BRL",
    "order_id": "123",
    "status": "CANCELED",
    "credit_cancel": {
    "canceled_at": "2021-05-04T02:49:33.981Z",
    "message": "Credit transaction cancelled sucessfully"
  }
}
```