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

    _init(){
        let _this = this;

        if(typeof(WebSocket)!==undefined){
            let cb = function(_socket){
                _this._clientInit(_socket);
            }
            this._type = 'client';
            this._socket.onopen = cb;
        }else{
            this._type = 'server';
            this._socket.on('connection',(_socket)=>{
                this._serverInit(_socket);
            });
        }
        console.log(`websocket started on port: ${this._port}`);
    }

    _serverInit(_socket){
        let _this = this,
            onMsgHandle = this._getProp('_onMsg'),
            onConnectionHandle = this._getProp('_onConnection'),
            onCloseHandle = this._getProp('_onClose');

        if(this._getProp('_type') === 'server'){
            _this._clientList.push(_socket);
        }

        if(onConnectionHandle !== null){
            onConnectionHandle.call(_this,_socket);
        }

        _socket.on('message',(msg)=>{
            
            if(onMsgHandle !== null){
                onMsgHandle.call(_this,msg);
            }

            if(_this._getProp('_debugMode')){
                console.log('msg recevied:',msg);
            }
        });

        _socket.on('close',(msg)=>{
            if(onCloseHandle !== null){
                onCloseHandle.call(_this,msg);
            }

            if(_this._getProp('_debugMode')){
                console.log('disconnented:',msg);
            }
        });
    }

    _clientInit(_socket){
        let _this = this,
            onMsgHandle = this._getProp('_onMsg'),
            onOpenHandle = this._getProp('_onOpen'),
            onCloseHandle = this._getProp('_onClose');

        if(_this._getProp('_debugMode')){
            console.log('socket connect:',_socket);
        }

        if(onOpenHandle !== null){
            onOpenHandle.call(_this,_socket);
        }

        this._socket.onMessage = function(){
            if(onMsgHandle !== null){
                onMsgHandle.call(_this,msg);
            }

            if(_this._getProp('_debugMode')){
                console.log('msg recevied:',msg);
            }
        };

        this._socket.onClose = function(){
            if(onCloseHandle !== null){
                onCloseHandle.call(_this,msg);
            }

            if(_this._getProp('_debugMode')){
                console.log('disconnented:',msg);
            }
        };
    }

    _getProp(key){
        return this[key] !== undefined ? this[key] : null;
    }

    _setProp(key,value){
        if(this[key]!==undefined){
            this[key] = value;
        }
    }
}
