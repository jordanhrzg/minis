import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

const axios = require('axios');

//ref: https://samples.landr.com/packs/pantone-classic-blue-sample-pack?creator=eyJ2ZXJzaW9uIjoxLCJicG0iOjEyMCwia2V5Um9vdCI6IkMiLCJrZXlRdWFsaXR5IjoibWFqb3IiLCJzYW1wbGVzIjpbXX0%3D

function calculateLocation(html){
    let result = ['COY'];
    // console.log(html);

    let parts = html.replace(/<br>/g, ' ');
    parts = parts.split(' ');
    for(let part of parts){
        if(part !== ''){
            result.push(part);
        }
    }
    result = result.join('_');
    result += '.wav';
    // console.log(result);
    return result;
}


function AudioButton(props) {
    let className = (props.playing) ? "playing": "paused";
    return (
        <button className={className} key={props.location} onClick={props.onClick}>
            {props.name.name}
            <br />
            {props.name.bpm}
            <br />
            {props.name.key}
        </button>
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

            results = results.map(result => {
                result.playing = false;
                result.track = null;
                return result;
            });

            this.setState({
                audio: results
            });
        }
    }

    async handleClick(i){
        let audioArray = this.state.audio;
        let trackLocation = calculateLocation(i.target.innerHTML);

        if(i.target.className === 'paused'){
            console.log(`Getting ${trackLocation} from server & looping play ...`);

            //ref: https://developer.mozilla.org/en-US/docs/Web/Guide/Audio_and_video_delivery
            let context = new AudioContext();
            let request = new XMLHttpRequest();
            let source = null;
            request.open('GET', `http://localhost:3001/track?location=${trackLocation}`, true);
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

            audioArray.some((obj) => {
                if(obj.location === trackLocation){
                    obj.track = context;
                    obj.playing = true;
                    return true;
                } else {
                    return false;
                }
            });

        } else {
            console.log(`Pausing ${trackLocation} ...`);

            audioArray.some(function(obj){
                if(obj.location === trackLocation){
                    obj.track.suspend();
                    obj.playing = false;
                    return true;
                } else {
                    return false;
                }
            });
        }

        this.setState({
            audio: audioArray
        });
    }

    render(){
        let buttonArray = [];
        for(let file of this.state.audio) {
            buttonArray.push(
                <AudioButton
                    name={file.name}
                    playing={file.playing}
                    key={file.location}
                    onClick={async (i) => await this.handleClick(i)}
                />);
        }

        return (
            <div className="sound">
                <script>
                    {JSON.stringify(this.soundCall())}
                </script>
                <h1>Sound Board Testing</h1>
                <div className={"button-array"}>
                    {buttonArray}
                </div>
            </div>
        );
    }
}

ReactDOM.render(
    <SoundBoard />,
    document.getElementById('root')
);