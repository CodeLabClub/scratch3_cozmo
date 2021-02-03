const ArgumentType = require('../../extension-support/argument-type');
const BlockType = require('../../extension-support/block-type');
const formatMessage = require('format-message');
const AdapterBaseClient = require('../scratch3_eim/codelab_adapter_base.js');
const ScratchUIHelper = require("../scratch3_eim/scratch_ui_helper.js");

// todo: ['mystery', 'happy', 'winner', 'sad', 'surprised', 'dog', 'cat', 'sneeze', 'excited', 'bored'],
// https://base64.guru/converter/encode/image/svg
const blockIconURI = 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4KPCEtLSBHZW5lcmF0b3I6IEFkb2JlIElsbHVzdHJhdG9yIDI0LjAuMCwgU1ZHIEV4cG9ydCBQbHVnLUluIC4gU1ZHIFZlcnNpb246IDYuMDAgQnVpbGQgMCkgIC0tPgo8c3ZnIHZlcnNpb249IjEuMSIgaWQ9IuWbvuWxgl8xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB4PSIwcHgiIHk9IjBweCIKCSB2aWV3Qm94PSIwIDAgNDAgNDAiIHN0eWxlPSJlbmFibGUtYmFja2dyb3VuZDpuZXcgMCAwIDQwIDQwOyIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSI+CjxzdHlsZSB0eXBlPSJ0ZXh0L2NzcyI+Cgkuc3Qwe2ZpbGw6IzQ0NDg0Qzt9Cgkuc3Qxe2ZpbGw6I0YyRjJGMjt9Cgkuc3Qye2ZpbGw6IzI5QUJFMjt9Cjwvc3R5bGU+Cjx0aXRsZT7mianlsZXmj5Lku7bphY3lm77orr7orqE8L3RpdGxlPgo8ZyBpZD0iXzcuX0Nvem1vIj4KCTxnPgoJCTxwYXRoIGNsYXNzPSJzdDAiIGQ9Ik0xMS43OSw2LjYyaDE2LjQ5YzMuNTMsMCw2LjQ5LDIuODcsNi40OSw2LjQ5djE1LjgzYzAsMi41NC0yLjA1LDQuNTEtNC41MSw0LjUxbDAsMEg5LjgzCgkJCWMtMi41NCwwLTQuNTEtMi4wNS00LjUxLTQuNTFsMCwwVjEzLjE4QzUuMzEsOS40OSw4LjE5LDYuNjIsMTEuNzksNi42MnoiLz4KCQk8cGF0aCBjbGFzcz0ic3QxIiBkPSJNMzAuMjYsMzQuNjlIOS44M2MtMy4yLDAtNS44My0yLjYzLTUuODMtNS44M1YxMy4xOGMwLTQuMjYsMy40NS03Ljg3LDcuNzEtNy44N2gxNi41OAoJCQljNC4yNiwwLDcuNzEsMy40NSw3LjcxLDcuNzF2MTUuODNDMzYuMDksMzEuOTgsMzMuMzgsMzQuNjksMzAuMjYsMzQuNjl6IE0xMS43OSw3Ljg2Yy0yLjg3LDAtNS4xNywyLjM4LTUuMTcsNS4zNHYxNS42NwoJCQljMCwxLjg5LDEuMzksMy4yOSwzLjI5LDMuMjloMjAuMzVjMS44OSwwLDMuMjktMS4zOSwzLjI5LTMuMjlWMTMuMDJjMC0yLjg3LTIuMy01LjE3LTUuMTctNS4xN0MyOC4zOCw3Ljg2LDExLjc5LDcuODYsMTEuNzksNy44NgoJCQl6Ii8+Cgk8L2c+Cgk8Zz4KCQk8cGF0aCBjbGFzcz0ic3QyIiBkPSJNMTQuNDIsMTIuNDVoMi4wNWMwLjk5LDAsMS44OSwwLjksMS44OSwxLjg5djIuMzhjMCwwLjk5LTAuOSwxLjg5LTEuODksMS44OWgtMi4wNQoJCQljLTAuOTksMC0xLjg5LTAuOS0xLjg5LTEuODl2LTIuMzhDMTIuNTQsMTMuMjcsMTMuMjcsMTIuNDUsMTQuNDIsMTIuNDV6Ii8+Cgk8L2c+Cgk8Zz4KCQk8cGF0aCBjbGFzcz0ic3QyIiBkPSJNMjMuNzgsMTIuNDVoMi4wNWMwLjk5LDAsMS44OSwwLjksMS44OSwxLjg5djMuNjljMCwwLjk5LTAuOSwxLjg5LTEuODksMS44OWgtMi4wNQoJCQljLTAuOTksMC0xLjg5LTAuOS0xLjg5LTEuODl2LTMuNjlDMjEuODksMTMuMjcsMjIuNzksMTIuNDUsMjMuNzgsMTIuNDV6Ii8+Cgk8L2c+CjwvZz4KPC9zdmc+Cg==';
const menuIconURI = blockIconURI;

const SCRATCH_EXT_ID = 'cozmo';
const NODE_NAME = `node_${SCRATCH_EXT_ID}`;
const NODE_ID = `eim/${NODE_NAME}`;
const NODE_MIN_VERSION = "2.0.0";
const HELP_URL = `https://adapter.codelab.club/extension_guide/${SCRATCH_EXT_ID}/`;

// 翻译
const FormHelp = {
	en: "help",
	"zh-cn": "帮助",
};

const FormReset = {
  en: "reset",
  "zh-cn": "重置",
};

const FormHeadAngle = {
  en: 'head_angle',
  'zh-cn': '头部的俯仰角'
};

const FormSetHeadAngle = {
  en: 'set head angle to [x] degrees',
  'zh-cn': '将头部的俯仰角设置为[x]°'
};

const FormSetLiftHeight = {
  en: 'set lift height to [x]',
  'zh-cn': '将手臂高度设置为[x]'
};

const FormSetRobotVolume = {
  en: 'set robot volume to [x]',
  'zh-cn': '将音量设置为[x]'
};

const FormPose = {
  en: 'Robot Pose [x_y_z]',
  'zh-cn': 'Robot Pose [x_y_z]'
};

const FormWorld = {
  en: 'Robot World',
  'zh-cn': 'Robot World'
};

const FormCube = {
  en: 'Cube [cube_n]',
  'zh-cn': '方块 [cube_n]'
};

const FormGoToObject = {
  en: 'go to cube [cube_n] distance [distance]',
  'zh-cn': '前往方块 [cube_n] 距离 [distance]'
};

const Form_dock_with_cube = {
  en: 'dock with cube [cube_n] distance [distance]',
  'zh-cn': '驶入方块 [cube_n] 方位角 [distance]'
};


const FormGoToPose = {
  en: 'go to pose x[x]mm y[y]mm angle[angle_z]°',
  'zh-cn': '前往位置 x[x]mm y[y]mm angle_z[angle_z]°'
};

const Form_freeplay_behaviors = {
  en: '[turn] freeplay behaviors',
  'zh-cn': '[turn] 自由探索模式'
};

const Form_facial_expression_estimation = {
  en: '[turn] facial expression estimation',
  'zh-cn': '[turn] 表情识别'
};


const FormWhenFaceSeen = {
  en: 'when face [face_expression] [face_action] seen',
  'zh-cn': '当人脸 [face_expression] [face_action] seen'
};

const FormWhenCube = {
  en: 'when cube [object_id] [object_action]',
  'zh-cn': '当方块 [object_id] [object_action]'
};

const FormWhenPet = {
  en: 'when pet [pet_type] [pet_action]',
  'zh-cn': '当宠物 [pet_type] [pet_action]'
};

const FormSetEmitTimeout = {
  en: 'set wait timeout [emit_timeout]s',
  'zh-cn': '设置等待超时时间[emit_timeout]秒'
};

class AdapterClient {
  onAdapterPluginMessage(msg) {
    this.node_id = msg.message.payload.node_id;
    if (this.node_id === this.NODE_ID || this.node_id === 'ExtensionManager') {
      this.adapter_node_content_hat = msg.message.payload.content;
      this.adapter_node_content_reporter = msg.message.payload.content;
      console.log(`${this.NODE_ID} message->`, msg.message.payload.content);

      // event, 风险 所有事件可能互相冲刷
      let message_type = msg.message.payload.message_type;
      if (message_type === 'device_event') {
        console.log('device_event:', msg.message.payload.content);
        this.event_name = msg.message.payload.content.event_name;
        this.event_param = msg.message.payload.content.event_param;
      }
    }
  }

  notify_callback(msg) {
    // 使用通知机制直到自己退出
    // todo 重置
    console.log("notify_callback ->", msg)
    if (msg.message === `停止 ${this.NODE_ID}`) {
        this.ScratchUIHelper.reset();
    }
    if (msg.message === `${this.NODE_ID} 已断开`) {
      this.ScratchUIHelper.reset();
    }
  }

  constructor(node_id, help_url, runtime) {
    this.NODE_ID = node_id;
    this.HELP_URL = help_url;
    this._runtime = runtime;

    this.adapter_base_client = new AdapterBaseClient(
      null, // onConnect,
      null, // onDisconnect,
      null, // onMessage,
      this.onAdapterPluginMessage.bind(this), // onAdapterPluginMessage,
      null, // update_nodes_status,
      null, // node_statu_change_callback,
      this.notify_callback.bind(this),
      //this.notify_callback.bind(this),
      null, // error_message_callback,
      null, // update_adapter_status
      20,
      runtime
    );

    let list_timeout = 10000;
    this.ScratchUIHelper = new ScratchUIHelper(
      SCRATCH_EXT_ID,
      NODE_NAME,
      NODE_ID,
      NODE_MIN_VERSION,
      runtime,
      this.adapter_base_client,
      list_timeout
    );
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

  isTargetEvent(event_name, event_param = '') {
    //  事件名 参数，通用 可扩展
    let result;
    if (this.event_name && this.event_name === event_name) {
      if (event_param === 'any' || event_param === '') {
        result = true;
      } else {
        result = String(this.event_param) === String(event_param);
      }
      if (result === true) {
        // 同个插件里的，多个when 协同工作
        setTimeout(() => {
          this.event_name = '';
          this.event_param = '';
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
    // node_id, help_url, runtime, _Blocks
    runtime.registerPeripheralExtension(SCRATCH_EXT_ID, this);
    this.adapter_client = new AdapterClient(NODE_ID, HELP_URL, runtime);
    // this.adapter_client = new AdapterClient(NODE_ID, HELP_URL, runtime, this);
    this.emit_timeout = 5000; //ms
    // this.
  }

  scan() {
    return this.adapter_client.ScratchUIHelper.scan();
  }
  connect(id) {
      return this.adapter_client.ScratchUIHelper.connect(id);
  }
  disconnect() {
      return this.adapter_client.ScratchUIHelper.disconnect();
  }
  reset() {
      return this.adapter_client.ScratchUIHelper.reset();
  }
  isConnected() {
      return this.adapter_client.ScratchUIHelper.isConnected();
  }
  /**
   * @returns {object} metadata for this extension and its blocks.
   */
  _setLocale() {
    let now_locale = '';
    switch (formatMessage.setup().locale) {
      case 'en':
        now_locale = 'en';
        break;
      case 'zh-cn':
        now_locale = 'zh-cn';
        break;
      default:
        now_locale = 'zh-cn';
        break;
    }
    return now_locale;
  }

  getInfo() {
    let the_locale = this._setLocale();
    return {
      id: SCRATCH_EXT_ID,
      name: SCRATCH_EXT_ID,
      menuIconURI: menuIconURI,
      blockIconURI: blockIconURI,
      showStatusButton: true,
      blocks: [
        {
          opcode: 'open_help_url',
          blockType: BlockType.COMMAND,
          text: FormHelp[the_locale],
          arguments: {}
        },
        {
          opcode: 'set_emit_timeout',
          blockType: BlockType.COMMAND,
          text: FormSetEmitTimeout[the_locale],
          arguments: {
            emit_timeout: {
              type: ArgumentType.NUMBER,
              defaultValue: 5.0
            }
          }
        },
        {
          opcode: "control_node",
          blockType: BlockType.COMMAND,
          text: FormReset[the_locale],
        },
        "---",
        {
          opcode: 'say',
          blockType: BlockType.COMMAND,
          text: formatMessage({
            id: 'cozmo.say',
            default: 'say [TEXT]',
            description: 'cozmo say something.'
          }),
          arguments: {
            TEXT: {
              type: ArgumentType.STRING,
              defaultValue: 'hello'
            }
          }
        },
        {
          opcode: 'move',
          blockType: BlockType.COMMAND,
          text: formatMessage({
            id: 'cozmo.move',
            default: 'drive [distance]mm at [speed]mm/s',
            description: 'cozmo drive distance(mm) at speed(mm/s).'
          }),

          arguments: {
            distance: {
              type: ArgumentType.NUMBER,
              // menu: 'distance',
              defaultValue: 50
            },
            speed: {
              type: ArgumentType.NUMBER,
              // menu: 'speed',
              defaultValue: 100
            }
          }
        },
        {
          opcode: 'turn',
          blockType: BlockType.COMMAND,

          text: formatMessage({
            id: 'cozmo.turn',
            default: 'turn [angle]° at [speed] °/s',
            description: 'cozmo turn around.'
          }),

          arguments: {
            angle: {
              type: ArgumentType.NUMBER,
              // menu: 'angle',
              defaultValue: 90
            },
            speed: {
              type: ArgumentType.NUMBER,
              defaultValue: 90
            }
          }
        },
        {
          opcode: 'set_head_angle', // 表情
          blockType: BlockType.COMMAND,
          text: FormSetHeadAngle[the_locale],
          arguments: {
            x: {
              type: ArgumentType.NUMBER,
              defaultValue: 0 // -22.5 - 44.5
            }
          }
        },
        {
          opcode: 'get_head_angle', // 表情
          blockType: BlockType.REPORTER,
          text: FormHeadAngle[the_locale],
          arguments: {}
        },
        {
          opcode: 'set_lift_height', // 表情
          blockType: BlockType.COMMAND,
          text: FormSetLiftHeight[the_locale],
          arguments: {
            x: {
              type: ArgumentType.NUMBER,
              defaultValue: 0.2 // 0-1
            }
          }
        },
        {
          opcode: 'set_robot_volume',
          blockType: BlockType.COMMAND,
          text: FormSetRobotVolume[the_locale],
          arguments: {
            x: {
              type: ArgumentType.NUMBER,
              defaultValue: 0.8 // 0-1
            }
          }
        },
        '---',
        {
          opcode: 'get_pose', // 表情
          blockType: BlockType.REPORTER,
          text: FormPose[the_locale],
          arguments: {
            x_y_z: {
              type: ArgumentType.STRING,
              defaultValue: 'x', // 0-1
              menu: 'x_y_z'
            }
            
          }
        },
        /*{
          opcode: 'get_world', // 表情
          blockType: BlockType.REPORTER,
          text: FormWorld[the_locale],
          arguments: {
            x_y_z: {
              type: ArgumentType.STRING,
              defaultValue: 'x', // 0-1
              menu: 'x_y_z'
            }
            
          }
        },*/
        {
          opcode: 'get_cube', // 表情
          blockType: BlockType.REPORTER,
          text: FormCube[the_locale],
          arguments: {
            cube_n: {
              type: ArgumentType.STRING,
              defaultValue: '1',
              menu: 'cube_n'
            }
          }
        },
        {
          opcode: 'go_to_object', // 表情
          blockType: BlockType.COMMAND,
          text: FormGoToObject[the_locale],
          arguments: {
            cube_n: {
              type: ArgumentType.STRING,
              defaultValue: '1',
              menu: 'cube_n'
            },
            distance: {
              type: ArgumentType.STRING,
              defaultValue: '100',
            },
          }
        },
        {
          opcode: 'dock_with_cube', // 表情
          blockType: BlockType.COMMAND,
          text: Form_dock_with_cube[the_locale],
          arguments: {
            cube_n: {
              type: ArgumentType.STRING,
              defaultValue: '1',
              menu: 'cube_n'
            },
            distance: {
              type: ArgumentType.STRING,
              defaultValue: '0',
            },
          }
        },
        //
        {
          opcode: 'go_to_pose', // 表情
          blockType: BlockType.COMMAND,
          text: FormGoToPose[the_locale],
          arguments: {
            x: {
              type: ArgumentType.STRING,
              defaultValue: '100',
            },
            y: {
              type: ArgumentType.STRING,
              defaultValue: '0',
            },
            angle_z:{
              type: ArgumentType.STRING,
              defaultValue: '0',
            },
          }
        },
        '---',
        {
          opcode: 'freeplay_behaviors',
          blockType: BlockType.COMMAND,
          text: Form_freeplay_behaviors[the_locale],
          arguments: {
            turn: {
              type: ArgumentType.STRING,
              defaultValue: 'start',
              menu: 'turn'
            }
          }
        },
        {
          opcode: 'play_animation',
          blockType: BlockType.COMMAND,
          text: formatMessage({
            id: 'cozmo.play',
            default: 'play [EMOTION] animation',
            description: 'cozmo play  animation.'
          }),

          arguments: {
            EMOTION: {
              type: ArgumentType.NUMBER,
              menu: 'emotions',
              defaultValue: 'anim_greeting_happy_01'
            }
          }
        },
        {
          opcode: 'play_anim_trigger',
          blockType: BlockType.COMMAND,
          text: formatMessage({
            id: 'cozmo.play_anim_trigger',
            default: 'play [EMOTION] animation trigger',
            description: 'cozmo play  animation trigger.'
          }),

          arguments: {
            EMOTION: {
              type: ArgumentType.NUMBER,
              menu: 'trigger_emotions',
              defaultValue: 'CodeLabDog'
            }
          }
        },
        {
          opcode: 'whenObjectAction',
          blockType: BlockType.HAT,
          text: FormWhenCube[the_locale],
          arguments: {
            object_id: {
              type: ArgumentType.STRING,
              defaultValue: 'any',
              menu: 'object_id'
            },
            object_action: {
              type: ArgumentType.STRING,
              defaultValue: 'tapped',
              menu: 'object_action'
            }
          }
        },
        // robot.enable_facial_expression_estimation(enable=True)
        {
          opcode: 'facial_expression_estimation',
          blockType: BlockType.COMMAND,
          text: Form_facial_expression_estimation[the_locale],
          arguments: {
            turn: {
              type: ArgumentType.STRING,
              defaultValue: 'start',
              menu: 'turn'
            }
          }
        },
        {
          opcode: 'whenFaceAction',
          blockType: BlockType.HAT,
          text: FormWhenFaceSeen[the_locale],
          arguments: {
            face_action: {
              type: ArgumentType.STRING,
              defaultValue: 'appeared',
              menu: 'face_action'
            },
            face_expression: {
              type: ArgumentType.STRING,
              defaultValue: 'any',
              menu: 'face_expression'
            }
          }
        },
        {
          opcode: 'whenPetAction',
          blockType: BlockType.HAT,
          text: FormWhenPet[the_locale],
          arguments: {
            pet_action: {
              type: ArgumentType.STRING,
              defaultValue: 'appeared',
              menu: 'pet_action'
            },
            pet_type: {
              type: ArgumentType.STRING,
              defaultValue: 'any',
              menu: 'pet_type'
            }
          }
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
          opcode: 'whenComingEvent',
          blockType: BlockType.HAT,
          text: formatMessage({
            id: 'cozmo.whenComingEvent',
            default: 'when event [event_name] param [event_param]',
            description: 'when Coming Event'
          }),
          arguments: {
            event_name: {
              type: ArgumentType.STRING,
              defaultValue: 'ObjectAppeared'
            },
            event_param: {
              type: ArgumentType.STRING,
              defaultValue: '1'
            }
          }
        },
        {
          opcode: 'animation_name', // 表情
          blockType: BlockType.REPORTER,
          text: formatMessage({
            id: 'cozmo.animation_name',
            default: 'anim: [NAME]',
            description: 'animation name.'
          }),

          arguments: {
            NAME: {
              type: ArgumentType.STRING,
              defaultValue: 'anim_greeting_happy_01'
            }
          }
        },
        {
          opcode: 'python_exec',
          blockType: BlockType.COMMAND,
          text: formatMessage({
            id: 'cozmo.python_exec',
            default: 'eval [CODE]',
            description: 'run python code.'
          }),

          arguments: {
            CODE: {
              type: ArgumentType.STRING,
              defaultValue: 'robot.say_text("Hello World").wait_for_completed()'
            }
          }
        },
        {
          opcode: 'python_exec_repoter',
          blockType: BlockType.REPORTER,
          text: formatMessage({
            id: 'cozmo.python_exec_repoter',
            default: 'eval [CODE]',
            description: 'run python code.'
          }),

          arguments: {
            CODE: {
              type: ArgumentType.STRING,
              defaultValue: 'robot.world.get_light_cube(1)' // robot.world
            }
          }
        },
        {
          opcode: 'whenMessageReceive',
          blockType: BlockType.HAT,
          text: formatMessage({
            id: 'cozmo.whenMessageReceive',
            default: 'when I receive [message_content]',
            description: 'receive target message'
          }),
          arguments: {
            message_content: {
              type: ArgumentType.STRING,
              defaultValue: 'output'
            }
          }
        }
        /*
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
                */
      ],
      menus: {
        // emotions: ['mystery', 'happy', 'winner', 'sad', 'surprised', 'dog', 'cat', 'sneeze', 'excited', 'bored'], // 使用annotation
        emotions: {
          acceptReporters: true,
          items: [
            'anim_greeting_happy_01',
            'anim_reacttppl_surprise',
            'anim_bored_01'
          ]
        }, // 使用annotation
        trigger_emotions: {
          acceptReporters: true,
          items: ['CodeLabDog', 'CodeLabCat', 'CodeLabSneeze']
        },
        nodes_name: {
          acceptReporters: true,
          items: ['node_cozmo']
        },
        turn: {
          acceptReporters: true,
          items: ['start', 'stop']
        },
        object_id: ['any', '1', '2', '3'],
        object_action: [
          'tapped',
          'appeared',
          // erved",
          'disappeared',
          'moved'
        ], // map with adapter
        face_action: ['appeared', 'disappeared', "observed"],
        pet_action: ['appeared', 'disappeared'],
        pet_type: ['any', 'dog', 'cat'],
        face_expression: [
          'any',
          'happy',
          'sad',
          'surprised',
          'angry',
          'neutral'
        ],
        x_y_z: [
          'x',
          'y',
          'z'
        ],
        cube_n:[
          '1',
          '2',
          '3'
        ]
      }
    };
  }

  say(args) {
    const content = `robot.say_text('${args.TEXT}').wait_for_completed()`;
    return this.adapter_client.adapter_base_client.emit_with_messageid(
      NODE_ID,
      content,
      this.emit_timeout
    );
  }

  // move forword 速度 1s back 1s
  turn(args) {
    const angle = args.angle;
    // 控制区间
    // const speed = args.speed;
    const speed = args.speed;
    const content = `robot.turn_in_place(cozmo.util.degrees(${parseFloat(
      angle
    )}), speed=cozmo.util.degrees(${parseFloat(speed)})).wait_for_completed()`;
    return this.adapter_client.adapter_base_client.emit_with_messageid(
      NODE_ID,
      content,
      this.emit_timeout
    );
  }

  // 完全和官方的积木一样!
  move(args) {
    const distance = args.distance;
    const speed = args.speed;
    const content = `robot.drive_straight(cozmo.util.distance_mm(${parseFloat(
      distance
    )}), cozmo.util.speed_mmps(${parseFloat(speed)})).wait_for_completed()`;
    return this.adapter_client.adapter_base_client.emit_with_messageid(
      NODE_ID,
      content,
      this.emit_timeout
    );
  }

  play_animation(args) {
    const emo = args.EMOTION;
    const content = `robot.play_anim(name='${emo}').wait_for_completed()`;
    return this.adapter_client.adapter_base_client.emit_with_messageid(
      NODE_ID,
      content,
      this.emit_timeout
    );
  }
  play_anim_trigger(args) {
    const emo = args.EMOTION;
    const content = `robot.play_anim_trigger(cozmo.anim.Triggers.${emo}).wait_for_completed()`;
    return this.adapter_client.adapter_base_client.emit_with_messageid(
      NODE_ID,
      content,
      this.emit_timeout
    );
  }

  animation_name(args) {
    return args.NAME;
  }

  python_exec(args) {
    const code = args.CODE;
    const content = code;
    return this.adapter_client.adapter_base_client.emit_with_messageid(
      NODE_ID,
      content,
      this.emit_timeout
    );
  }

  python_exec_repoter(args) {
    const code = args.CODE;
    const content = code;
    return this.adapter_client.adapter_base_client.emit_with_messageid(
      NODE_ID,
      content,
      this.emit_timeout
    );
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

    facial_expression_estimation(args) {
      let _map = {
        "start": "True",
        "stop": "False"
      }
      let content = `robot.enable_facial_expression_estimation(enable=${_map[args.turn]})`;
      return this.adapter_client.adapter_base_client.emit_with_messageid(NODE_ID, content, this.emit_timeout);
    }

    whenFaceAction(args) {
        let _event_type = "Face";
        let action_map = {
            appeared: `${_event_type}Appeared`,
            observed: `${_event_type}Observed`,
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
        let event_name = "RobotObservedMotion";
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
        let content = "robot.head_angle.degrees";
        return this.adapter_client.adapter_base_client.emit_with_messageid(NODE_ID, content, this.emit_timeout);
    }

    set_head_angle(args) {
      let content = `robot.set_head_angle(cozmo.util.degrees(${args.x})).wait_for_completed()`;
      return this.adapter_client.adapter_base_client.emit_with_messageid(NODE_ID, content, this.emit_timeout);
    }

    set_lift_height(args) {
      let content = `robot.set_lift_height(${args.x}).wait_for_completed()`;
      return this.adapter_client.adapter_base_client.emit_with_messageid(NODE_ID, content, this.emit_timeout);
    }

    set_robot_volume(args) {
      let content = `robot.set_robot_volume(${args.x})`;
      return this.adapter_client.adapter_base_client.emit_with_messageid(NODE_ID, content, this.emit_timeout);
    }

    get_pose(args){
      let x_y_z = args.x_y_z;
      let content = `robot.pose.position.${x_y_z}`;
      return this.adapter_client.adapter_base_client.emit_with_messageid(NODE_ID, content, this.emit_timeout);
    }
    
    get_world(args){
      let x_y_z = args.x_y_z;
      let content = `robot.world`;
      return this.adapter_client.adapter_base_client.emit_with_messageid(NODE_ID, content, this.emit_timeout);
    }

    get_cube(args){
      let content = `robot.world.get_light_cube(${args.cube_n})`; // 
      return this.adapter_client.adapter_base_client.emit_with_messageid(NODE_ID, content, this.emit_timeout);
    }

    go_to_object(args){
      // let x_y_z = args.x_y_z;
      let content = `robot.go_to_object(robot.world.get_light_cube(${args.cube_n}), cozmo.util.distance_mm(${args.distance})).wait_for_completed()`;
      return this.adapter_client.adapter_base_client.emit_with_messageid(NODE_ID, content, this.emit_timeout);
    }

    dock_with_cube(args){
      // let x_y_z = args.x_y_z;
      // robot.dock_with_cube(cube, approach_angle=cozmo.util.degrees(180), num_retries=2)
      let content = `robot.dock_with_cube(robot.world.get_light_cube(${args.cube_n}), approach_angle=cozmo.util.degrees(${args.distance}), num_retries=2).wait_for_completed()`;
      return this.adapter_client.adapter_base_client.emit_with_messageid(NODE_ID, content, this.emit_timeout);
    }

    go_to_pose(args){
      //robot.go_to_pose(Pose(100, 100, 0, angle_z=degrees(45)), relative_to_robot=True).wait_for_completed()
      let code = `robot.go_to_pose(cozmo.util.Pose(${args.x}, ${args.y}, 0, angle_z=cozmo.util.degrees(${args.angle_z})), relative_to_robot=True).wait_for_completed()`;
      return this.adapter_client.adapter_base_client.emit_with_messageid(NODE_ID, code, this.emit_timeout);
    }

    freeplay_behaviors(args){
      //robot.go_to_pose(Pose(100, 100, 0, angle_z=degrees(45)), relative_to_robot=True).wait_for_completed()
      let code = `robot.${args.turn}_freeplay_behaviors()`;
      return this.adapter_client.adapter_base_client.emit_with_messageid(NODE_ID, code, this.emit_timeout);
    }

    control_node(args) {
      // ui是由结束通知完成的
      const content = "stop";
      const node_name = NODE_NAME;
      return this.adapter_client.adapter_base_client.emit_with_messageid_for_control(
          NODE_ID,
          content,
          node_name,
          "node"
      );
    }

    open_help_url(args) {
        window.open(HELP_URL);
    }

    set_emit_timeout(args){
        const timeout = parseFloat(args.emit_timeout) * 1000;
        this.emit_timeout = timeout;
    }
}

module.exports = Scratch3CozmoBlocks;
