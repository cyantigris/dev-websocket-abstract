module.exports = class Websocket_abstract{
    constructor(socket,port,host,debug){
        this._socket = socket;
        this._port = port;
        this._debugMode = debug === undefined ? false : debug;
        this._clientList = [];
        this._onMsg = null;
        this._onConnection = null;
        this._onClose = null;
        this._init();
    }

    _init(){
        let _this = this,
            onMsgHandle = this._getProp('_onMsg'),
            onConnectionHandle = this._getProp('_onConnection'),
            onCloseHandle = this._getProp('_onClose');
        
        this._socket.on('connection',(_socket)=>{

            if(_this.getProp('_debugMode')){
                console.log('socket connect:',_socket);
            }

            if(socketType === 'server'){
                _this.clientList.push(_socket);
            }
            
            if(onConnectionHandle !== null){
                onConnectionHandle.call(_this,_socket);
            }
            
            _socket.on('message',(msg)=>{
                
                if(onMsgHandle !== null){
                    onMsgHandle.call(_this,msg);
                }

                if(_this.getProp('_debugMode')){
                    console.log('msg recevied:',msg);
                }
            });

            _socket.on('close',(msg)=>{
                if(onCloseHandle !== null){
                    onCloseHandle.call(_this,msg);
                }

                if(_this.getProp('_debugMode')){
                    console.log('disconnented:',msg);
                }
            });
        });

        console.log(`websocket started on port: ${this._port}`);
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
