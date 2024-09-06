import { Address, beginCell, Cell, Contract, contractAddress, ContractProvider, Sender, SendMode } from "@ton/core";

export type HelloWorldConfig = {};

export type HelloWorldConfig2 ={
    number: number,
    address: Address,
    owner_address: Address
};

export function helloWorldConfigToCell(config: HelloWorldConfig): Cell {
    return beginCell().endCell();
}

// It is going to receive a MainContractConfig type of object, properly pack those parameters into a cell and return it. 
// We need this because as you remember, the c4 storage is a memory cell:

export function mainContractConfigToCell(config: HelloWorldConfig2):Cell{
    return beginCell().storeUint(config.number,32).storeAddress(config.address).storeAddress(config.owner_address).endCell();
}

export class HelloWorld implements Contract {
    constructor(
        readonly address: Address, 
        readonly init?: { code: Cell; data: Cell }) {}

    static createFromAddress(address: Address) {
        return new HelloWorld(address);
    }

    // createFromConfig is accepting a config with data that we will in future store in contract's persistent storage and code of the contract. 
    // In return, we get an instance of a contract that we can easily interact with help of sandbox.

    static createFromConfig(config: HelloWorldConfig2, code: Cell, workchain = 0) {
        // const data = helloWorldConfigToCell(config);
        const data = mainContractConfigToCell(config);
        const init = { code, data };
        
        // Calculate the address of the contract by passing the init params. Bascically create2 type thing here. We can get address before hand.
        const address =  contractAddress(workchain, init);
        
        // Creating a new instance of our class HelloWorld with address and init params passed.
        return new HelloWorld(address, init);
    }

    async sendDeploy(provider: ContractProvider, via: Sender, value: bigint) {
        await provider.internal(via, {
            value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: beginCell().endCell(),
        });
    }

    async sendInternalMessage(
        provider: ContractProvider,
        sender: Sender,
        value: bigint
    ){
        await provider.internal(sender, {
            value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: beginCell().endCell(),
        });
    }

    // async getData(
    //     provider: ContractProvider
    // ){
    //     const {stack} = await provider.get(
    //         "get_the_latest_sender",[]
    //     );
    //     console.log("Checking the stack")
    //     console.log(stack);
    //     //console.log(stack.readAddress());
    //     return {
    //         recent_sender: stack.readAddress(),
    //     };
    // }

    async sendIncrement(
        provider: ContractProvider,
        sender: Sender,
        value: bigint,
        increment_by: number
    ){
        const msg_body = beginCell().
        storeUint(1,32)
        .storeUint(increment_by,32)
        .endCell();

        await provider.internal(sender,{
            value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: msg_body,
        });
         
    }

    async getData(provider: ContractProvider){
        const {stack} = await provider.get(
            "get_contract_storage_data",[]
        );

        // console.log(stack);
        return {
            number: stack.readNumber(),
            recent_sender: stack.readAddress(),
            owner_address: stack.readAddress()
        };
    }

    async getBalance(provider: ContractProvider){
        const {stack} = await provider.get("balance",[]);
        // console.log(stack.readNumber());
        
        return {
            number: stack.readNumber(),
        }
    }

    async sendDeposit(provider: ContractProvider,sender:Sender, value: bigint){
        const in_msg_body = beginCell().storeUint(2,32). // Op code
        endCell();

        await provider.internal(sender,{
            value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: in_msg_body,
        });
    }

    async sendBadCommand(provider: ContractProvider,sender: Sender,value: bigint){
        const in_msg_body = beginCell().storeUint(4,32). // Op code
        endCell();

        await provider.internal(sender,{
            value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: in_msg_body,
        });
    }

    async sendDeposit2(provider: ContractProvider,sender:Sender, value: bigint){
        const in_msg_body = beginCell().storeUint(2,32). // Op code
        endCell();

        await provider.internal(sender,{
            value,
            sendMode: SendMode.CARRY_ALL_REMAINING_INCOMING_VALUE,
            body: in_msg_body,
        });
    }

    async sendNoCommand(provider: ContractProvider,sender:Sender,value: bigint){
        const in_msg_body = beginCell().endCell();

        await provider.internal(sender,{
            value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: in_msg_body,
        });
    }

    async sendTest(
        provider: ContractProvider,
        sender: Sender,
        value: bigint,
        amount: bigint
    ) {
        const msg_body = beginCell()
        .storeUint(3, 32)
        .storeCoins(amount)
        .endCell();

        await provider.internal(sender, {
            value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: msg_body,
        });
    }

    async senddWithdrawalRequest(
        provider: ContractProvider,
        sender: Sender,
        value: bigint,
        amount: bigint
      ) {
        const msg_body = beginCell()
          .storeUint(3, 32) // OP code
          .storeCoins(amount)
          .endCell();
    
        await provider.internal(sender, {
          value,
          sendMode: SendMode.PAY_GAS_SEPARATELY,
          body: msg_body,
        });
    }
}
