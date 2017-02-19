module.exports = class Websocket_abstract{
    constructor(socket,port,host,debug){
        this._type = null;
        this._socket = socket;
        this._port = port;
        this._debugMode = debug === undefined ? false : debug;
        this._clientList = [];
        this._onMsg = null;
        this._onOpen = null;
        this._onConnection = null;
        this._onClose = null;
        this._init();
    }

    getProp(key){
        return this[key] !== undefined ? this[key] : null;
    }

    setProp(key,value){
        if(this[key]!==undefined)
            this[key] = value;
    }

    _init(){
        let _this = this;
        
        if(typeof(WebSocket) !== 'undefined'){
            let cb = function(_socket){
                _this._clientInit.call(_this,_socket);
            }
            this._type = 'client';
            this._socket.onopen = cb;
        }else{
            this._type = 'server';
            this._socket.on('connection',(_socket)=>{
                _this._serverInit.call(_this,_socket);
            });
        }
        console.log(`websocket started on port: ${this._port}`);
    }

    _serverInit(_socket){
        let _this = this,
            onMsgHandle = this.getProp('_onMsg'),
            onConnectionHandle = this.getProp('_onConnection'),
            onCloseHandle = this.getProp('_onClose'),
            _clientList = _this.getProp('_clientList');

        _clientList.push(_socket);
        _this.setProp('_clientList',_clientList);

        if(_this.getProp('_debugMode'))
            console.log('A socket connected');

        if(onConnectionHandle !== null)
            onConnectionHandle.call(_this,_socket);

        _socket.on('message',(msg)=>{
            
            if(_this.getProp('_debugMode'))
                console.log(`msg recevied:`,msg);

            if(onMsgHandle !== null)
                onMsgHandle.call(_this,msg,_socket);
        });

        _socket.on('close',(msg)=>{
            let _clientList = _this.getProp('_clientList'),
                _newList = [];

            for(let i  of _clientList){
                if(_socket !== i)  
                    _newList.push(i);
            }
            _this.setProp('_newList',_clientList);

            if(_this.getProp('_debugMode'))
                console.log('disconnented:',msg);

            if(onCloseHandle !== null) 
                onCloseHandle.call(_this,msg);
        });
    }

    _clientInit(_socket){
        let _this = this,
            onMsgHandle = this.getProp('_onMsg'),
            onOpenHandle = this.getProp('_onOpen'),
            onCloseHandle = this.getProp('_onClose');

        if(_this.getProp('_debugMode'))
            console.log('socket connect:',_socket);

        if(onOpenHandle !== null)
            onOpenHandle.call(_this,_socket);

        this._socket.addEventListener('message', (msg)=>{

            if(_this.getProp('_debugMode'))
                console.log(`${msg.timeStamp} msg recevied:`,msg);

            if(onMsgHandle !== null)
                onMsgHandle.call(_this,msg);
        },false);

        this._socket.addEventListener('close', (msg)=>{
            if(_this.getProp('_debugMode'))
                console.log('disconnented:',msg);
            
            if(onCloseHandle !== null)
                onCloseHandle.call(_this,msg);
        },false);
    }
}
