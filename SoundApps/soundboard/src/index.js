import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

const axios = require('axios');

//ref: https://samples.landr.com/packs/pantone-classic-blue-sample-pack?creator=eyJ2ZXJzaW9uIjoxLCJicG0iOjEyMCwia2V5Um9vdCI6IkMiLCJrZXlRdWFsaXR5IjoibWFqb3IiLCJzYW1wbGVzIjpbXX0%3D

export default class AudioButton extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            name: props.name,
            fileLocation: props.location,
            track: null,
            playing: false
        };
    }

    async handleClick(){
        if(this.state.track === null || !this.state.playing){
            console.log(`Getting ${this.state.fileLocation} from server & looping play ...`);

            //ref: https://developer.mozilla.org/en-US/docs/Web/Guide/Audio_and_video_delivery
            let context = new AudioContext();
            let request = new XMLHttpRequest();
            let source = null;
            request.open('GET', `http://localhost:3001/track?location=${this.state.fileLocation}`, true);
            request.responseType = 'arraybuffer';
            request.onload = function(){
                context.decodeAudioData(request.response, function(buffer){
                    source = context.createBufferSource();
                    source.buffer = buffer;
                    source.connect(context.destination);
                    source.start(0);
                    source.loop = true;
                })
            };
            request.send();

            this.state.track = context;
            this.state.playing = true;

        } else {
            console.log(`Pausing ${this.state.fileLocation} ...`);
            this.state.track.suspend();
            this.state.playing = false;
        }
    }

    render() {
        return(
            <button className={(this.state.playing) ? "playing" : "paused"} key={this.state.fileLocation} onClick={async () => await this.handleClick()}>
                {this.state.name.name}
                <br />
                {this.state.name.bpm}
                <br />
                {this.state.name.key}
            </button>
        );
    }
}

function Board(props){
    let buttonArray = [];
    for(let file of props.audioFiles) {
        buttonArray.push(new AudioButton(file));
    }
    return (
        <div className={"button-array"}>
            {buttonArray.map(button => button.render())}
        </div>
    );
}

class SoundBoard extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            audio: []
        };
    }

    async soundCall() {
        if(this.state.audio.length === 0) {
            console.log("Getting track listings from server ...");
            let results = {};
            await axios.get('http://localhost:3001', {"Access-Control-Allow-Origin": "http://localhost:3001"}).then(function (response) {
                results = response.data;
            });

            console.log(`Received ${results.length} track listings from server.`);

            this.setState({
                audio: results
            });
        }
    }

    render(){
        return (
            <div className="sound">
                <script>
                    {JSON.stringify(this.soundCall())}
                </script>
                <h1>Sound Board Testing</h1>
                <Board
                    audioFiles={this.state.audio}
                />
            </div>
        );
    }
}

ReactDOM.render(
    <SoundBoard />,
    document.getElementById('root')
);