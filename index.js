const ArgumentType = require("../../extension-support/argument-type");
const BlockType = require("../../extension-support/block-type");
const formatMessage = require("format-message");
const io = require("socket.io-client");
const RateLimiter = require("../../util/rateLimiter.js");

// todo: ['mystery', 'happy', 'winner', 'sad', 'surprised', 'dog', 'cat', 'sneeze', 'excited', 'bored'],
const cozmoIcon =
    "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB3aWR0aD0iMTkycHQiIGhlaWdodD0iMTczcHQiIHZpZXdCb3g9IjAgMCAxOTIgMTczIiB2ZXJzaW9uPSIxLjEiPgo8ZyBpZD0ic3VyZmFjZTEiPgo8cGF0aCBzdHlsZT0iIHN0cm9rZTpub25lO2ZpbGwtcnVsZTpldmVub2RkO2ZpbGw6cmdiKDEwMCUsNzIuMTU2ODYzJSwxMS43NjQ3MDYlKTtmaWxsLW9wYWNpdHk6MTsiIGQ9Ik0gMTEyLjgwNDY4OCAxMzYuMzE2NDA2IEMgODMuNTQ2ODc1IDExNi41MzEyNSA3Ni4yMTQ4NDQgOTQuMzYzMjgxIDkwLjgwODU5NCA2OS44MDg1OTQgQyAxMTIuNjk1MzEyIDMyLjk4MDQ2OSAxMjQuMTEzMjgxIDE5LjI0MjE4OCAxMjAuNDQ5MjE5IDAuMTg3NSBDIDEzNC44NzUgMTYuOTIxODc1IDE3Ni40MTc5NjkgNjIuNTAzOTA2IDEzMS43ODkwNjIgMTE1LjQwNjI1IEMgMTMxLjc4OTA2MiA5NC44NjMyODEgMTI3LjA5Mzc1IDgzLjI0NjA5NCAxMTcuNjk5MjE5IDgwLjU0Njg3NSBDIDExMS4yNDIxODggODguMjg5MDYyIDEwOC4wMTE3MTkgOTguMTg3NSAxMDguMDExNzE5IDExMC4yMzgyODEgQyAxMDguMDExNzE5IDEyMi4yOTI5NjkgMTA5LjYwOTM3NSAxMzAuOTg0Mzc1IDExMi44MDQ2ODggMTM2LjMxNjQwNiBaIE0gMTEyLjgwNDY4OCAxMzYuMzE2NDA2ICIvPgo8cGF0aCBzdHlsZT0iIHN0cm9rZTpub25lO2ZpbGwtcnVsZTpldmVub2RkO2ZpbGw6cmdiKDIzLjEzNzI1NSUsMjQuNzA1ODgyJSwyNi42NjY2NjclKTtmaWxsLW9wYWNpdHk6MTsiIGQ9Ik0gMC40MTAxNTYgMTU1LjEzNjcxOSBDIDEuMjIyNjU2IDE1MC4yNDIxODggMy4yOTY4NzUgMTQ2LjQ3NjU2MiA2LjU1ODU5NCAxNDMuNTM5MDYyIEMgMTAuNjMyODEyIDEzOS44NTE1NjIgMTUuODk0NTMxIDEzNC40MjU3ODEgMjEuNTI3MzQ0IDEzNi45ODgyODEgQyAyMi40MTc5NjkgMTM3LjM2MzI4MSAyMy4wMDc4MTIgMTM4LjM0Mzc1IDIyLjQ5MjE4OCAxMzkuOTI1NzgxIEMgMjAuOTMzNTk0IDE0NC41MTk1MzEgMTYuNzg1MTU2IDE0NC4yMTg3NSAxMy4yMjY1NjIgMTQ2Ljg1MTU2MiBDIDEwLjI2NTYyNSAxNDkuMTg3NSA3LjY3MTg3NSAxNTIuMTk5MjE5IDcuNDQ5MjE5IDE1NS44OTA2MjUgQyA3LjMwMDc4MSAxNTggNy42NzE4NzUgMTYwLjg1OTM3NSA5LjAwMzkwNiAxNjIuODk0NTMxIEMgMTAuNTU4NTk0IDE2NS4zNzg5MDYgMTMuMjI2NTYyIDE2NS42Nzk2ODggMTUuODIwMzEyIDE2Ni42NjAxNTYgQyAxOS43NSAxNjguMTY0MDYyIDIyLjM0Mzc1IDE2Mi43NDIxODggMjUuNjAxNTYyIDE2Mi41OTM3NSBDIDI4Ljg2MzI4MSAxNjIuMzY3MTg4IDI2Ljc4OTA2MiAxNjcuMTA5Mzc1IDI2LjA0Njg3NSAxNjguMzE2NDA2IEMgMjIuMzQzNzUgMTc0LjExMzI4MSAxNS40NDkyMTkgMTczLjI4NTE1NiA5Ljc0NjA5NCAxNzEuNjI4OTA2IEMgMi44NTU0NjkgMTY5LjU5NzY1NiAtMC43NzczNDQgMTYyLjU5Mzc1IDAuNDEwMTU2IDE1NS4xMzY3MTkgWiBNIDM1LjA1ODU5NCAxNjguNjc5Njg4IEMgMzAuMDE5NTMxIDE2NS42Njc5NjkgMjcuODcxMDk0IDE1OS4zMzk4NDQgMjkuNSAxNTMuNjE3MTg4IEMgMzAuNjg3NSAxNDkuNDAyMzQ0IDMzLjM1NTQ2OSAxNDcuMjE0ODQ0IDM0LjI0MjE4OCAxNDUuMTA5Mzc1IEMgMzYuMDIzNDM4IDE0MS4wNDI5NjkgNDEuMjEwOTM4IDE0Mi4yNDYwOTQgNDQuMDIzNDM4IDE0NS40MTAxNTYgQyA0NS45NTMxMjUgMTQ3LjY2Nzk2OSA0Ni45ODgyODEgMTUwLjIzMDQ2OSA0Ny42NTYyNSAxNTIuNzg5MDYyIEMgNDkuMjEwOTM4IDE1OC43MzgyODEgNDYuNDcyNjU2IDE2My43ODUxNTYgNDIuNTQyOTY5IDE2OCBDIDQwLjkxNDA2MiAxNjkuNzM0Mzc1IDM3LjA1ODU5NCAxNjkuODA4NTk0IDM1LjA1ODU5NCAxNjguNjc5Njg4IFogTSAzNy40Mjk2ODggMTYxLjIyMjY1NiBDIDQyLjc2NTYyNSAxNjIuNDI5Njg4IDQzLjI4NTE1NiAxNTUuMTk5MjE5IDM5LjI4MTI1IDE1MC43NTc4MTIgQyAzNy42NTIzNDQgMTQ5LjAyMzQzOCAyOS42NDg0MzggMTU5LjQxNzk2OSAzNy40Mjk2ODggMTYxLjIyMjY1NiBaIE0gNTQuMzYzMjgxIDE1Ni4wMjczNDQgQyA1NC4zNjMyODEgMTQ2LjYxMzI4MSA2NS43NzM0MzggMTQ1LjE4MzU5NCA3MS40ODA0NjkgMTQwLjUxNTYyNSBDIDczLjI1NzgxMiAxMzkuMDA3ODEyIDcyLjUxNTYyNSAxMzUuMDkzNzUgNzMuNjI4OTA2IDEzMi41MzEyNSBDIDc0LjY2Nzk2OSAxMzAuNzIyNjU2IDc2LjgxNjQwNiAxMjkuMjE4NzUgNzguNTkzNzUgMTI5Ljk3MjY1NiBDIDc5LjMzNTkzOCAxMzAuMzQ3NjU2IDgxLjAzOTA2MiAxMzEuNDc2NTYyIDgwLjc0MjE4OCAxMzIuOTA2MjUgQyA3Ni40NDUzMTIgMTQ0LjgwODU5NCA3Ni44MTY0MDYgMTU3LjgzNTkzOCA3OC45NjQ4NDQgMTcwLjU2MjUgQyA3OC45NjQ4NDQgMTcxLjIzODI4MSA3Ny4xODc1IDE3Mi4zNzEwOTQgNzYuMDc0MjE5IDE3Mi4zNzEwOTQgQyA3Mi44ODY3MTkgMTcyLjc0NjA5NCA3Mi44ODY3MTkgMTY4IDcxLjEwOTM3NSAxNjcuNjI1IEMgNjguMjE4NzUgMTY3LjYyNSA2NS4zMjgxMjUgMTY4LjQ1MzEyNSA2Mi41ODU5MzggMTY2LjU3MDMxMiBDIDU4Ljk1NzAzMSAxNjQuMDg1OTM4IDU0LjM2MzI4MSAxNjEuNTIzNDM4IDU0LjM2MzI4MSAxNTYuMDI3MzQ0IFogTSA2MS44NDc2NTYgMTU0Ljk3MjY1NiBDIDYyLjM2NzE4OCAxNTguNTg5ODQ0IDY2LjQ0MTQwNiAxNjIuMjAzMTI1IDcwLjM2NzE4OCAxNjAuNzczNDM4IEMgNjkuNzAzMTI1IDE1Ni40MDIzNDQgNzEuMTA5Mzc1IDE1Mi40MTQwNjIgNzEuMTA5Mzc1IDE0OC4xMjEwOTQgQyA2Ny4xODM1OTQgMTQ4LjEyMTA5NCA2MS4xMDU0NjkgMTUwLjMwNDY4OCA2MS44NDc2NTYgMTU0Ljk3MjY1NiBaIE0gODUuNzQ2MDk0IDE1MS42NjAxNTYgQyA4NS41OTc2NTYgMTQ0LjIwMzEyNSA5MS4wMDM5MDYgMTM4Ljc4MTI1IDk4LjI2NTYyNSAxMzkuODM1OTM4IEMgMTA0LjA0Njg3NSAxNDAuNjY0MDYyIDEwOS4zMDg1OTQgMTQ2LjMxMjUgMTA5LjIzNDM3NSAxNTIuNjQwNjI1IEMgMTA4LjA1MDc4MSAxNTYuMjUzOTA2IDk5Ljc1IDE1OS4zMzk4NDQgOTYuOTMzNTk0IDE2Mi4wNTA3ODEgQyA5Ni42MzY3MTkgMTYyLjEyODkwNiA5NS4zMDQ2ODggMTYyLjg3ODkwNiA5NS43NSAxNjMuNjMyODEyIEMgOTguMzM5ODQ0IDE2OC4yMjY1NjIgMTAzLjA4NTkzOCAxNjYuMTk1MzEyIDEwNy4yMzQzNzUgMTY0LjAxMTcxOSBDIDEwOS45MDIzNDQgMTY1Ljk2ODc1IDEwOC40OTIxODggMTcwLjQ4ODI4MSAxMDUuNDU3MDMxIDE3MC45Mzc1IEMgMTAyLjEyMTA5NCAxNzEuNDY0ODQ0IDk4LjQ4ODI4MSAxNzIuMzcxMDk0IDk0LjkzMzU5NCAxNzAuNzg5MDYyIEMgODcuNTIzNDM4IDE2Ny4zOTg0MzggODUuODk0NTMxIDE1OC44OTA2MjUgODUuNzQ2MDk0IDE1MS42NjAxNTYgWiBNIDkzLjgyMDMxMiAxNTUuNSBDIDk3LjMwNDY4OCAxNTUuMzUxNTYyIDEwMC43MTQ4NDQgMTU0LjM3MTA5NCAxMDEuODI0MjE5IDE1MC43NTc4MTIgQyAxMDMuNDUzMTI1IDE0Ni45OTIxODggOTcuMzA0Njg4IDE0NS4wMzEyNSA5NC4zMzk4NDQgMTQ2LjYxMzI4MSBDIDkxLjA3ODEyNSAxNDguMzQ3NjU2IDkyLjA0Mjk2OSAxNTUuMzUxNTYyIDkzLjgyMDMxMiAxNTUuNSBaIE0gMTQ5LjgzMjAzMSAxNzEuOTQxNDA2IEMgMTQ4LjQ5MjE4OCAxNzEuMjUgMTQ4LjIyMjY1NiAxNjkuMzg2NzE5IDE0Ny4xOTE0MDYgMTY5LjQ5NjA5NCBDIDE0MS44NTU0NjkgMTY5LjA3MDMxMiAxMzUuOTkyMTg4IDE2OS45OTIxODggMTMyLjUxOTUzMSAxNjUuMjg1MTU2IEMgMTMwLjI0NjA5NCAxNjIuODAwNzgxIDEzMC41IDE1Ny4zOTQ1MzEgMTMyLjA4MjAzMSAxNTQuNzMwNDY5IEMgMTM3LjE5NTMxMiAxNDUuOTM3NSAxNDcuODU1NDY5IDE0Ny4zOTA2MjUgMTQ3Ljk4MDQ2OSAxNDcuMTQ4NDM4IEMgMTQ4LjUzMTI1IDE0Ni4wMzEyNSAxNDguNjIxMDk0IDE0Mi42MTMyODEgMTQ2Ljk2ODc1IDE0Mi40ODQzNzUgQyAxNDIuNTE5NTMxIDE0MS45Njg3NSAxNDAuMDAzOTA2IDE0NC4yNzczNDQgMTM2LjIzODI4MSAxNDYuMDM5MDYyIEMgMTMzLjQwMjM0NCAxNDcuMzk4NDM4IDEzMi4xMDE1NjIgMTQxLjQwMjM0NCAxMzIuNjk1MzEyIDE0MC42NTYyNSBDIDEzNy42MTcxODggMTM2LjQyOTY4OCAxNDguMzc1IDEzMy4xNzU3ODEgMTUyLjQyOTY4OCAxMzkuODYzMjgxIEMgMTU2LjA0Njg3NSAxNDUuOTE3OTY5IDE1My4xNzU3ODEgMTUyLjY2MDE1NiAxNTMuMzkwNjI1IDE1OS42Nzk2ODggQyAxNTMuNTc0MjE5IDE2NC4yNzczNDQgMTU0LjE3NTc4MSAxNzQuMjg1MTU2IDE0OS44MzIwMzEgMTcxLjk0MTQwNiBaIE0gMTQ2LjY2MDE1NiAxNjMuNDg0Mzc1IEMgMTQ3LjMyODEyNSAxNTkuNjQwNjI1IDE0OS4yNTM5MDYgMTU3LjA4MjAzMSAxNDcuNjI1IDE1My4wODk4NDQgQyAxNDMuMzI0MjE5IDE1NC43NDYwOTQgMTM1LjgzOTg0NCAxNTMuNDY4NzUgMTM1LjY5MTQwNiAxNTkuOTQ1MzEyIEMgMTM1LjYxNzE4OCAxNjMuMjU3ODEyIDE0Ni4wNjY0MDYgMTY0LjkxNDA2MiAxNDYuNjYwMTU2IDE2My40ODQzNzUgWiBNIDE2Ny43MzgyODEgMTcwLjc4OTA2MiBDIDE2Ni45OTYwOTQgMTcwLjYzNjcxOSAxNjYuMTc5Njg4IDE2OS4yMDcwMzEgMTY1LjgxMjUgMTY4LjM3ODkwNiBDIDE2NC45OTYwOTQgMTYxLjMwMDc4MSAxNjUuODEyNSAxNTQuNTk3NjU2IDE2NC4yNTM5MDYgMTQ3LjUxOTUzMSBDIDE2My44MDg1OTQgMTQ2LjMxMjUgMTYyLjY5OTIxOSAxNDQuNzMwNDY5IDE2My4wNzAzMTIgMTQzLjE0ODQzOCBDIDE2My40NDE0MDYgMTQyLjM5ODQzOCAxNjQuMjUzOTA2IDE0MS45NDUzMTIgMTY0LjYyNSAxNDEuMTkxNDA2IEMgMTY0Ljk5NjA5NCAxMzYuNDQ5MjE5IDE2My45NTcwMzEgMTMxLjc3NzM0NCAxNjQuOTk2MDk0IDEyNi45NTcwMzEgQyAxNjUuNTE1NjI1IDEyNC42MjUgMTY4LjkyMTg3NSAxMjEuMDg1OTM4IDE3MC44NTE1NjIgMTIzLjc5Njg3NSBDIDE3NS4wNzQyMTkgMTI4LjE2NDA2MiAxNjguOTIxODc1IDEzNC40ODgyODEgMTcxLjk2MDkzOCAxMzkuOTg4MjgxIEMgMTgwLjE4NzUgMTQwLjM2MzI4MSAxODguNzA3MDMxIDE0My41MjczNDQgMTkxLjM3NSAxNTEuNDMzNTk0IEMgMTkzLjAwNzgxMiAxNTYuMTc5Njg4IDE4OS44MjAzMTIgMTYxLjY3NTc4MSAxODUuOTY0ODQ0IDE2NC40NjA5MzggQyAxODAuNTU4NTk0IDE2OC4zNzg5MDYgMTc0LjMzMjAzMSAxNzEuOTkyMTg4IDE2Ny43MzgyODEgMTcwLjc4OTA2MiBaIE0gMTczLjE0ODQzOCAxNjMuMjU3ODEyIEMgMTcxLjIxODc1IDE1Ny43NTc4MTIgMTcxLjIxODc1IDE1MS44MDg1OTQgMTcxLjIxODc1IDE0Ni4zMTI1IEMgMTc2LjYyODkwNiAxNDUuNTU4NTk0IDE4NC42MzI4MTIgMTQ5LjA5NzY1NiAxODQuNzgxMjUgMTU0LjIxODc1IEMgMTg1LjAwMzkwNiAxNTkuNzE4NzUgMTc4LjE4NzUgMTYyLjg3ODkwNiAxNzMuMTQ4NDM4IDE2My4yNTc4MTIgWiBNIDEyMC42ODc1IDE3MS4yMzQzNzUgQyAxMTguMDM1MTU2IDE3MS4yMzQzNzUgMTE1LjIyNjU2MiAxNjguOTQ5MjE5IDExNS44MTY0MDYgMTYzLjk2MDkzOCBDIDExNi40MTAxNTYgMTU4Ljk3NjU2MiAxMTYuNjgzNTk0IDE2MS41IDExNy4yOTI5NjkgMTUyLjI3NzM0NCBDIDExNy44OTg0MzggMTQzLjA1NDY4OCAxMTcuMjkyOTY5IDEzNC44OTQ1MzEgMTE3LjI5Mjk2OSAxMjguNjI4OTA2IEMgMTE3LjI5Mjk2OSAxMjIuMzYzMjgxIDEwOC4yODkwNjIgMTA0Ljc4NTE1NiAxMjAuNzE0ODQ0IDEwNC43ODUxNTYgQyAxMjYuNDAyMzQ0IDEwNy4wNTg1OTQgMTIzLjU1MDc4MSAxMTMuMDQ2ODc1IDEyMy41NTA3ODEgMTE4LjUzMTI1IEMgMTIzLjU1MDc4MSAxMjQuODAwNzgxIDEyMy41NTA3ODEgMTI3LjQxMDE1NiAxMjMuNTUwNzgxIDEzMC43OTY4NzUgQyAxMjMuNTUwNzgxIDEzNC4xODc1IDEyMy41NTA3ODEgMTQ2LjYwNTQ2OSAxMjMuNTUwNzgxIDE1NS40ODA0NjkgQyAxMjMuNTUwNzgxIDE2NC4zNTU0NjkgMTIzLjM0Mzc1IDE3MS4yMzQzNzUgMTIwLjY4NzUgMTcxLjIzNDM3NSBaIE0gMTIwLjY4NzUgMTcxLjIzNDM3NSAiLz4KPC9nPgo8L3N2Zz4K";

const blockIconURI = cozmoIcon;
const menuIconURI = cozmoIcon;

const NODE_ID = "eim/node_cozmo";
const HELP_URL = "https://adapter.codelab.club/extension_guide/cozmo/";

class AdapterClient {
    constructor(node_id, help_url) {
        const ADAPTER_TOPIC = "adapter/nodes/data";
        const EXTS_OPERATE_TOPIC = "core/exts/operate";
        const NODES_OPERATE_TOPIC = "core/nodes/operate";
        this.SCRATCH_TOPIC = "scratch/extensions/command";
        this.NODE_ID = node_id;
        this.HELP_URL = help_url;
        this.plugin_topic_map = {
            node: NODES_OPERATE_TOPIC,
            extension: EXTS_OPERATE_TOPIC,
        };

        this._requestID = 0;
        this._promiseResolves = {};
        const SendRateMax = 10;
        this._rateLimiter = new RateLimiter(SendRateMax);

        const url = new URL(window.location.href);
        var adapterHost = url.searchParams.get("adapter_host"); // 支持树莓派(分布式使用)
        if (!adapterHost) {
            var adapterHost = window.__static
                ? "127.0.0.1"
                : "codelab-adapter.codelab.club";
        }
        // console.log(`${this.NODE_ID} ready to connect adapter...`)
        this.socket = io(
            `${window.__static ? "https:" : ""}//${adapterHost}:12358` +
                "/test",
            {
                transports: ["websocket"],
            }
        );

        this.socket.on("sensor", (msg) => {
            this.topic = msg.message.topic;
            this.node_id = msg.message.payload.node_id;
            const message_id = msg.message.payload.message_id;
            if (
                this.topic === ADAPTER_TOPIC &&
                (this.node_id === this.NODE_ID ||
                    this.node_id === "ExtensionManager")
            ) {
                // 只接收当前插件消息
                // ExtensionManager 回复关于插件的控制信息
                window.message = msg;
                this.adapter_node_content_hat = msg.message.payload.content;
                this.adapter_node_content_reporter =
                    msg.message.payload.content;
                console.log(
                    `${this.NODE_ID} message->`,
                    msg.message.payload.content
                );
                // event, 风险 所有事件可能互相冲刷
                let message_type = msg.message.payload.message_type;
                if (message_type === "device_event") {
                    console.log("device_event:", msg.message.payload.content);
                    this.event_name = msg.message.payload.content.event_name;
                    this.event_param = msg.message.payload.content.event_param;
                }
                // 处理对应id的resolve
                if (typeof message_id !== "undefined") {
                    this._promiseResolves[message_id] &&
                        this._promiseResolves[message_id](
                            msg.message.payload.content
                        );
                }
            }
        });
    }

    get_reply_message(messageID) {
        const timeout = 5000; // ms todo 交给用户选择
        return new Promise((resolve, reject) => {
            this._promiseResolves[messageID] = resolve; // 抛到外部
            setTimeout(() => {
                reject(`timeout(${timeout}ms)`);
            }, timeout);
        });
    }

    emit_with_messageid(node_id, content) {
        const messageID = this._requestID++;
        const payload = {};
        payload.node_id = node_id;
        payload.content = content;
        payload.message_id = messageID;
        this.socket.emit("actuator", {
            payload: payload,
            topic: this.SCRATCH_TOPIC,
        });
        return this.get_reply_message(messageID);
    }

    emit_without_messageid(node_id, content) {
        const payload = {};
        payload.node_id = node_id;
        payload.content = content;
        this.socket.emit("actuator", {
            payload: payload,
            topic: this.SCRATCH_TOPIC,
        });
    }

    emit_with_messageid_for_control(node_id, content, node_name, pluginType) {
        if (!this._rateLimiter.okayToSend()) return Promise.resolve();

        const messageID = this._requestID++;
        const payload = {};
        payload.node_id = node_id;
        payload.content = content;
        payload.message_id = messageID;
        payload.node_name = node_name;
        this.socket.emit("actuator", {
            payload: payload,
            topic: this.plugin_topic_map[pluginType],
        });
        return this.get_reply_message(messageID);
    }

    isTargetMessage(content) {
        //rename bool func
        if (
            this.adapter_node_content_hat &&
            content === this.adapter_node_content_hat
        ) {
            setTimeout(() => {
                this.adapter_node_content_hat = null; // 每次清空
            }, 1); //ms 1/1000 s
            return true;
        }
    }

    isTargetEvent(event_name, event_param = "") {
        //  事件名 参数，通用 可扩展
        let result;
        if (this.event_name && this.event_name === event_name) {
            if (event_param === "any" || event_param === "") {
                result = true;
            } else {
                result = String(this.event_param) === String(event_param);
            }
            if (result === true) {
                // 同个插件里的，多个when 协同工作
                setTimeout(() => {
                    this.event_name = "";
                    this.event_param = "";
                }, 1); //避免清理随后的事件 1/1000 s
                return result;
            }
        }
    }
}

class Scratch3CozmoBlocks {
    constructor(runtime) {
        /**
         * The runtime instantiating this block package.
         * @type {Runtime}
         */
        this.adapter_client = new AdapterClient(NODE_ID, HELP_URL);
    }

    /**
     * @returns {object} metadata for this extension and its blocks.
     */
    getInfo() {
        return {
            id: "cozmo",
            name: "Cozmo",
            menuIconURI: menuIconURI,
            blockIconURI: blockIconURI,
            blocks: [
                {
                    opcode: "open_help_url",
                    blockType: BlockType.COMMAND,
                    text: formatMessage({
                        id: "cozmo.open_help_url",
                        default: "help",
                        description: "open help url",
                    }),
                    arguments: {},
                },
                {
                    opcode: "control_node",
                    blockType: BlockType.COMMAND,
                    text: formatMessage({
                        id: "cozmo.control_node",
                        default: "[turn] [node_name]",
                        description: "turn on/off the node of cozmo",
                    }),
                    arguments: {
                        turn: {
                            type: ArgumentType.STRING,
                            defaultValue: "start",
                            menu: "turn",
                        },
                        node_name: {
                            type: ArgumentType.STRING,
                            defaultValue: "node_cozmo",
                            menu: "nodes_name",
                        },
                    },
                },
                {
                    opcode: "say",
                    blockType: BlockType.COMMAND,
                    text: formatMessage({
                        id: "cozmo.say",
                        default: "say [TEXT]",
                        description: "cozmo say something.",
                    }),
                    arguments: {
                        TEXT: {
                            type: ArgumentType.STRING,
                            defaultValue: "hello",
                        },
                    },
                },
                {
                    opcode: "move",
                    blockType: BlockType.COMMAND,
                    text: formatMessage({
                        id: "cozmo.move",
                        default: "drive [distance]mm at [speed]mm/s",
                        description: "cozmo drive distance(mm) at speed(mm/s).",
                    }),

                    arguments: {
                        distance: {
                            type: ArgumentType.NUMBER,
                            // menu: 'distance',
                            defaultValue: 50,
                        },
                        speed: {
                            type: ArgumentType.NUMBER,
                            // menu: 'speed',
                            defaultValue: 100,
                        },
                    },
                },
                {
                    opcode: "turn",
                    blockType: BlockType.COMMAND,

                    text: formatMessage({
                        id: "cozmo.turn",
                        default: "turn [angle]° at [speed] °/s",
                        description: "cozmo turn around.",
                    }),

                    arguments: {
                        angle: {
                            type: ArgumentType.NUMBER,
                            // menu: 'angle',
                            defaultValue: 90,
                        },
                        speed: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 90,
                        },
                    },
                },
                {
                    opcode: "get_head_angle", // 表情
                    blockType: BlockType.REPORTER,
                    text: formatMessage({
                        id: "cozmo.get_head_angle",
                        default: "head_angle",
                        description: "head angle.",
                    }),

                    arguments: {},
                },
                {
                    opcode: "play_animation",
                    blockType: BlockType.COMMAND,
                    text: formatMessage({
                        id: "cozmo.play",
                        default: "play [EMOTION] animation",
                        description: "cozmo play  animation.",
                    }),

                    arguments: {
                        EMOTION: {
                            type: ArgumentType.NUMBER,
                            menu: "emotions",
                            defaultValue: "anim_greeting_happy_01",
                        },
                    },
                },
                {
                    opcode: "whenObjectAction",
                    blockType: BlockType.HAT,
                    text: formatMessage({
                        id: "cozmo.whenObjectAction",
                        default: "when cube [object_id] [object_action]",
                        description: "when cube tap",
                    }),
                    arguments: {
                        object_id: {
                            type: ArgumentType.STRING,
                            defaultValue: "any",
                            menu: "object_id",
                        },
                        object_action: {
                            type: ArgumentType.STRING,
                            defaultValue: "tapped",
                            menu: "object_action",
                        },
                    },
                },
                {
                    opcode: "whenFaceAction",
                    blockType: BlockType.HAT,
                    text: formatMessage({
                        id: "cozmo.whenFaceAction",
                        default: "when face [face_expression] [face_action] seen",
                        description: "when face ...",
                    }),
                    arguments: {
                        face_action: {
                            type: ArgumentType.STRING,
                            defaultValue: "appeared",
                            menu: "face_action",
                        },
                        face_expression: {
                            type: ArgumentType.STRING,
                            defaultValue: "any",
                            menu: "face_expression",
                        },
                    },
                },
                {
                    opcode: "whenPetAction",
                    blockType: BlockType.HAT,
                    text: formatMessage({
                        id: "cozmo.whenPetAction",
                        default: "when pet [pet_type] [pet_action]",
                        description: "when pet ...",
                    }),
                    arguments: {
                        pet_action: {
                            type: ArgumentType.STRING,
                            defaultValue: "appeared",
                            menu: "pet_action",
                        },
                        pet_type: {
                            type: ArgumentType.STRING,
                            defaultValue: "any",
                            menu: "pet_type",
                        },
                    },
                },
                /*{
                    opcode: "whenRobotObservedMotion",
                    blockType: BlockType.HAT,
                    text: formatMessage({
                        id: "cozmo.whenRobotObservedMotion",
                        default: "when robot observed motion",
                        description: "when robot observed motion",
                    }),
                    arguments: {
                    },
                },*/
                {
                    opcode: "whenComingEvent",
                    blockType: BlockType.HAT,
                    text: formatMessage({
                        id: "cozmo.whenComingEvent",
                        default: "when event [event_name] param [event_param]",
                        description: "when Coming Event",
                    }),
                    arguments: {
                        event_name: {
                            type: ArgumentType.STRING,
                            defaultValue: "motion",
                        },
                        event_param: {
                            type: ArgumentType.STRING,
                            defaultValue: "1",
                        },
                    },
                },
                {
                    opcode: "animation_name", // 表情
                    blockType: BlockType.REPORTER,
                    text: formatMessage({
                        id: "cozmo.animation_name",
                        default: "anim: [NAME]",
                        description: "animation name.",
                    }),

                    arguments: {
                        NAME: {
                            type: ArgumentType.STRING,
                            defaultValue: "anim_greeting_happy_01",
                        },
                    },
                },
                {
                    opcode: "python_exec",
                    blockType: BlockType.COMMAND,
                    text: formatMessage({
                        id: "cozmo.python_exec",
                        default: "exec [CODE]",
                        description: "run python code.",
                    }),

                    arguments: {
                        CODE: {
                            type: ArgumentType.STRING,
                            defaultValue:
                                'robot.say_text("Hello World").wait_for_completed()',
                        },
                    },
                },
                {
                    opcode: "python_exec_repoter",
                    blockType: BlockType.REPORTER,
                    text: formatMessage({
                        id: "cozmo.python_exec_repoter",
                        default: "exec [CODE]",
                        description: "run python code.",
                    }),

                    arguments: {
                        CODE: {
                            type: ArgumentType.STRING,
                            defaultValue: "robot.lift_height.distance_mm",
                        },
                    },
                },
                {
                    opcode: "whenMessageReceive",
                    blockType: BlockType.HAT,
                    text: formatMessage({
                        id: "cozmo.whenMessageReceive",
                        default: "when I receive [message_content]",
                        description: "receive target message",
                    }),
                    arguments: {
                        message_content: {
                            type: ArgumentType.STRING,
                            defaultValue: "output",
                        },
                    },
                },
                {
                    opcode: "getComingMessage",
                    blockType: BlockType.REPORTER, // BOOLEAN, COMMAND
                    text: formatMessage({
                        id: "cozmo.getComingMessage",
                        default: "received message",
                        description: "received message",
                    }),
                    arguments: {},
                },
            ],
            menus: {
                // emotions: ['mystery', 'happy', 'winner', 'sad', 'surprised', 'dog', 'cat', 'sneeze', 'excited', 'bored'], // 使用annotation
                emotions: {
                    acceptReporters: true,
                    items: [
                    "anim_greeting_happy_01",
                    "anim_reacttppl_surprise",
                    "anim_bored_01",
                ]}, // 使用annotation
                nodes_name: {
                    acceptReporters: true,
                    items: ["node_cozmo"],
                },
                turn: {
                    acceptReporters: true,
                    items: ["start", "stop"],
                },
                object_id: ["any", "1", "2", "3"],
                object_action: [
                    "tapped",
                    "appeared",
                    // erved",
                    "disappeared",
                    "moved",
                ], // map with adapter
                face_action: ["appeared", "disappeared"],
                pet_action: ["appeared", "disappeared"],
                pet_type: ["any", "dog", "cat"],
                face_expression: [
                    "any",
                    "happy",
                    "sad",
                    "surprised",
                    "angry",
                    "neutral",
                ],
            },
        };
    }

    say(args) {
        const content = `robot.say_text('${args.TEXT}').wait_for_completed()`;
        return this.adapter_client.emit_with_messageid(NODE_ID, content);
    }

    // move forword 速度 1s back 1s
    turn(args) {
        const angle = args.angle;
        // 控制区间
        // const speed = args.speed;
        const speed = args.speed;
        const content = `robot.turn_in_place(cozmo.util.degrees(${parseFloat(
            angle
        )}), speed=cozmo.util.degrees(${parseFloat(
            speed
        )})).wait_for_completed()`;
        return this.adapter_client.emit_with_messageid(NODE_ID, content);
    }

    // 完全和官方的积木一样!
    move(args) {
        const distance = args.distance;
        const speed = args.speed;
        const content = `robot.drive_straight(cozmo.util.distance_mm(${parseFloat(
            distance
        )}), cozmo.util.speed_mmps(${parseFloat(speed)})).wait_for_completed()`;
        return this.adapter_client.emit_with_messageid(NODE_ID, content);
    }

    play_animation(args) {
        const emo = args.EMOTION;
        const content = `robot.play_anim(name='${emo}').wait_for_completed()`;
        return this.adapter_client.emit_with_messageid(NODE_ID, content);
    }

    animation_name(args) {
        return args.TEXT;
    }

    python_exec(args) {
        const code = args.CODE;
        const content = code;
        return this.adapter_client.emit_with_messageid(NODE_ID, content);
    }

    python_exec_repoter(args) {
        const code = args.CODE;
        const content = code;
        return this.adapter_client.emit_with_messageid(NODE_ID, content);
    }

    // when receive
    whenMessageReceive(args) {
        const targetContent = args.origin_content;
        return this.adapter_client.isTargetMessage(targetContent);
    }

    // when receive
    whenObjectAction(args) {
        // 多类行为
        // map
        /*
        {
            "tapped": "ObjectTapped",
            "observed":"ObjectObserved",
            "disappeared": "ObjectDisappeared",
            "moved": "ObjectMovingStarted"
        }
        */
        let action_map = {
            appeared: "ObjectAppeared",
            tapped: "ObjectTapped",
            // observed: "ObjectObserved",
            disappeared: "ObjectDisappeared",
            moved: "ObjectMovingStarted",
        };
        let object_action = args.object_action; //"ObjectTapped";
        let event_name = action_map[object_action];
        let event_param = args.object_id; //menu all, 1,2,3
        return this.adapter_client.isTargetEvent(event_name, event_param);
    }

    whenFaceAction(args) {
        let _event_type = "Face";
        let action_map = {
            appeared: `${_event_type}Appeared`,
            // observed: `${_event_type}Observed`,
            disappeared: `${_event_type}Disappeared`,
        };
        let face_action = args.face_action; //"ObjectTapped";
        let event_name = action_map[face_action];
        // let event_param = args.face_id; //menu all, 1,2,3
        let event_param = args.face_expression;
        return this.adapter_client.isTargetEvent(event_name, event_param);
    }

    whenPetAction(args) {
        let _event_type = "Pet";
        let action_map = {
            appeared: `${_event_type}Appeared`,
            // observed: `${_event_type}Observed`,
            disappeared: `${_event_type}Disappeared`,
        };
        let pet_action = args.pet_action; //"ObjectTapped";
        let event_name = action_map[pet_action];
        let event_param = args.pet_type; //menu all, 1,2,3
        return this.adapter_client.isTargetEvent(event_name);
    }

    whenRobotObservedMotion(args) {
        let event_name = "RobotObservedMotion"
        return this.adapter_client.isTargetEvent(event_name);
    }

    // when receive
    whenComingEvent(args) {
        let event_name = args.event_name;
        let event_param = args.event_param;
        return this.adapter_client.isTargetEvent(event_name, event_param);
    }

    getComingMessage() {
        return this.adapter_client.adapter_node_content_reporter;
    }

    get_head_angle(args) {
        content = "robot.head_angle.degrees";
        return this.adapter_client.emit_with_messageid(NODE_ID, content);
    }

    control_node(args) {
        const content = args.turn;
        const node_name = args.node_name;
        return this.adapter_client.emit_with_messageid_for_control(
            NODE_ID,
            content,
            node_name,
            "node"
        );
    }

    open_help_url(args) {
        window.open(HELP_URL);
    }
}

module.exports = Scratch3CozmoBlocks;
