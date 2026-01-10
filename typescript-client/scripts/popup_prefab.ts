import Bitmap from "openfl/display/Bitmap";
import BitmapData from "openfl/display/BitmapData";
import Event from "openfl/events/Event";
import MouseEvent from "openfl/events/MouseEvent";

import { SecNum } from "./com/cc/utils/SecNum";
import { ImageCache } from "./com/monsters/display/ImageCache";
import { InstanceManager } from "./com/monsters/managers/InstanceManager";
import { PATHING } from "./com/monsters/pathing/PATHING";
import { Kit } from "./com/monsters/kits/Kit";
import { popup_prefab_CLIP } from "./popup_prefab_CLIP";
import { popup_prefab_enlarge } from "./popup_prefab_enlarge";
import { GLOBAL } from "./GLOBAL";
import { KEYS } from "./KEYS";
import { BASE } from "./BASE";
import { BFOUNDATION } from "./BFOUNDATION";
import { BUY } from "./BUY";
import { POPUPS } from "./POPUPS";
import { LOGGER } from "./LOGGER";
import { ACHIEVEMENTS } from "./ACHIEVEMENTS";
import { CREATURES } from "./CREATURES";
import { CREEPS } from "./CREEPS";

// Kit data for prefab buildings (JSON strings stored in Vector)
const KIT_DATA_1 = '{"0":{"Y":-105,"t":112,"id":0,"X":-65},"1":{"Y":-165,"t":21,"prefab":5,"id":1,"X":-155},"2":{"Y":25,"t":21,"prefab":5,"id":2,"X":-15},"3":{"Y":-175,"t":21,"prefab":5,"id":3,"X":125},"4":{"Y":15,"t":20,"prefab":5,"id":4,"X":-155},"5":{"Y":25,"t":20,"prefab":5,"id":5,"X":125},"6":{"Y":-175,"t":20,"prefab":5,"id":6,"X":-15},"7":{"Y":-75,"t":25,"id":7,"X":-155},"8":{"Y":115,"t":15,"prefab":2,"id":8,"X":35},"9":{"Y":-295,"t":13,"prefab":2,"id":9,"X":-35},"10":{"Y":115,"t":13,"prefab":2,"id":10,"X":-65},"11":{"Y":-285,"t":5,"prefab":2,"id":11,"X":-125},"13":{"Y":-85,"t":22,"id":13,"X":85},"14":{"rCP":1,"Y":-175,"t":1,"prefab":8,"id":14,"X":-85},"15":{"rCP":10,"Y":25,"t":1,"prefab":8,"id":15,"X":55},"16":{"rCP":9,"Y":-175,"t":2,"prefab":8,"id":16,"X":55},"17":{"rCP":2,"Y":25,"t":2,"prefab":8,"id":17,"X":-85},"18":{"Y":-195,"t":17,"prefab":2,"id":18,"X":165},"19":{"rCP":3,"Y":-40,"t":3,"prefab":8,"id":19,"X":-255},"20":{"rCP":10,"Y":-35,"t":4,"prefab":8,"id":20,"X":225},"21":{"rCP":7,"Y":-110,"t":4,"prefab":8,"id":21,"X":-255},"22":{"Y":-75,"t":17,"prefab":3,"id":22,"X":185},"23":{"Y":-65,"t":17,"prefab":3,"id":23,"X":-85},"24":{"Y":-95,"t":17,"prefab":3,"id":24,"X":185},"25":{"Y":-105,"t":17,"prefab":3,"id":25,"X":85},"26":{"Y":-55,"t":17,"prefab":3,"id":26,"X":185},"27":{"Y":-105,"t":17,"prefab":3,"id":27,"X":125},"28":{"Y":-35,"t":17,"prefab":3,"id":28,"X":185},"29":{"Y":-105,"t":17,"prefab":3,"id":29,"X":105},"30":{"Y":-45,"t":17,"prefab":3,"id":30,"X":-85},"31":{"Y":-105,"t":17,"prefab":3,"id":31,"X":145},"32":{"Y":-25,"t":17,"prefab":3,"id":32,"X":-85},"33":{"Y":5,"t":17,"prefab":3,"id":33,"X":165},"34":{"Y":-105,"t":17,"prefab":3,"id":34,"X":65},"35":{"Y":5,"t":17,"prefab":3,"id":35,"X":145},"36":{"Y":-105,"t":17,"prefab":3,"id":36,"X":165},"37":{"Y":5,"t":17,"prefab":3,"id":37,"X":125},"38":{"Y":-5,"t":17,"prefab":3,"id":38,"X":-185},"39":{"Y":-5,"t":17,"prefab":3,"id":39,"X":65},"40":{"Y":-85,"t":17,"prefab":3,"id":40,"X":65},"41":{"Y":5,"t":17,"prefab":3,"id":41,"X":85},"42":{"Y":-65,"t":17,"prefab":3,"id":42,"X":65},"43":{"Y":5,"t":17,"prefab":3,"id":43,"X":105},"44":{"Y":-45,"t":17,"prefab":3,"id":44,"X":65},"45":{"Y":-85,"t":17,"prefab":3,"id":45,"X":-185},"46":{"Y":-25,"t":17,"prefab":3,"id":46,"X":65},"47":{"Y":-45,"t":17,"prefab":3,"id":47,"X":-185},"48":{"Y":-95,"t":17,"prefab":3,"id":48,"X":-145},"49":{"Y":-95,"t":17,"prefab":3,"id":49,"X":-165},"50":{"Y":-95,"t":17,"prefab":3,"id":50,"X":-105},"51":{"Y":-95,"t":17,"prefab":3,"id":51,"X":-125},"52":{"Y":-85,"t":17,"prefab":3,"id":52,"X":-85},"53":{"Y":-65,"t":17,"prefab":3,"id":53,"X":-185},"54":{"Y":-25,"t":17,"prefab":3,"id":54,"X":-185},"55":{"Y":-5,"t":17,"prefab":3,"id":55,"X":-165},"56":{"Y":-5,"t":17,"prefab":3,"id":56,"X":-105},"57":{"Y":-5,"t":17,"prefab":3,"id":57,"X":-145},"58":{"Y":-5,"t":17,"prefab":3,"id":58,"X":-125},"59":{"Y":-15,"t":17,"prefab":3,"id":59,"X":185},"60":{"Y":-5,"t":17,"prefab":3,"id":60,"X":-85},"61":{"Y":5,"t":17,"prefab":3,"id":61,"X":185},"62":{"Y":-195,"t":17,"prefab":2,"id":62,"X":185},"63":{"Y":-185,"t":17,"prefab":2,"id":63,"X":-115},"64":{"Y":95,"t":17,"prefab":2,"id":64,"X":165},"65":{"Y":95,"t":17,"prefab":2,"id":65,"X":145},"66":{"Y":95,"t":17,"prefab":3,"id":66,"X":125},"67":{"Y":95,"t":17,"prefab":3,"id":67,"X":105},"68":{"Y":95,"t":17,"prefab":3,"id":68,"X":85},"69":{"Y":95,"t":17,"prefab":3,"id":69,"X":65},"70":{"Y":95,"t":17,"prefab":3,"id":70,"X":45},"71":{"Y":95,"t":17,"prefab":3,"id":71,"X":25},"72":{"Y":95,"t":17,"prefab":3,"id":72,"X":5},"73":{"Y":95,"t":17,"prefab":3,"id":73,"X":-15},"74":{"Y":95,"t":17,"prefab":3,"id":74,"X":-35},"75":{"Y":95,"t":17,"prefab":3,"id":75,"X":-55},"76":{"Y":95,"t":17,"prefab":3,"id":76,"X":-75},"77":{"Y":95,"t":17,"prefab":3,"id":77,"X":-95},"78":{"Y":95,"t":17,"prefab":2,"id":78,"X":-115},"79":{"Y":95,"t":17,"prefab":2,"id":79,"X":-135},"80":{"Y":85,"t":17,"prefab":2,"id":80,"X":-155},"81":{"Y":15,"t":17,"prefab":3,"id":81,"X":-185},"82":{"Y":35,"t":17,"prefab":2,"id":82,"X":-185},"83":{"Y":55,"t":17,"prefab":2,"id":83,"X":-185},"84":{"Y":75,"t":17,"prefab":2,"id":84,"X":-175},"85":{"Y":95,"t":17,"prefab":2,"id":85,"X":185},"86":{"Y":75,"t":17,"prefab":2,"id":86,"X":195},"87":{"Y":55,"t":17,"prefab":2,"id":87,"X":195},"88":{"Y":35,"t":17,"prefab":2,"id":88,"X":205},"89":{"Y":15,"t":17,"prefab":3,"id":89,"X":205},"90":{"Y":-115,"t":17,"prefab":3,"id":90,"X":-175},"91":{"Y":-135,"t":17,"prefab":2,"id":91,"X":-175},"92":{"Y":-155,"t":17,"prefab":2,"id":92,"X":-175},"93":{"Y":-175,"t":17,"prefab":2,"id":93,"X":-175},"94":{"Y":-185,"t":17,"prefab":2,"id":94,"X":-155},"95":{"Y":-185,"t":17,"prefab":2,"id":95,"X":-135},"96":{"Y":-195,"t":17,"prefab":2,"id":96,"X":145},"97":{"Y":-195,"t":17,"prefab":3,"id":97,"X":-95},"98":{"Y":-195,"t":17,"prefab":3,"id":98,"X":-75},"99":{"Y":-195,"t":17,"prefab":3,"id":99,"X":-55},"100":{"Y":-195,"t":17,"prefab":3,"id":100,"X":-35},"101":{"Y":-195,"t":17,"prefab":3,"id":101,"X":-15},"102":{"Y":-195,"t":17,"prefab":3,"id":102,"X":5},"103":{"Y":-195,"t":17,"prefab":3,"id":103,"X":25},"104":{"Y":-195,"t":17,"prefab":3,"id":104,"X":45},"105":{"Y":-195,"t":17,"prefab":3,"id":105,"X":65},"106":{"Y":-195,"t":17,"prefab":3,"id":106,"X":85},"107":{"Y":-195,"t":17,"prefab":3,"id":107,"X":105},"108":{"Y":-115,"t":17,"prefab":3,"id":108,"X":195},"110":{"Y":-135,"t":17,"prefab":2,"id":110,"X":195},"111":{"Y":-155,"t":17,"prefab":2,"id":111,"X":195},"112":{"Y":-175,"t":17,"prefab":2,"id":112,"X":195},"113":{"Y":-195,"t":17,"prefab":3,"id":113,"X":125},"114":{"rCP":6,"Y":-105,"t":3,"prefab":8,"id":114,"X":225}}';
const KIT_DATA_2 = '{"0":{"Y":-85,"t":112,"id":0,"X":-145},"1":{"Y":-315,"t":21,"prefab":6,"id":1,"X":-215},"2":{"Y":45,"t":21,"prefab":6,"id":2,"X":145},"3":{"Y":-155,"t":21,"prefab":6,"id":3,"X":-375},"4":{"Y":205,"t":21,"prefab":6,"id":4,"X":-15},"5":{"Y":-155,"t":20,"prefab":6,"id":5,"X":-85},"6":{"Y":45,"t":20,"prefab":6,"id":6,"X":-145},"7":{"Y":-155,"t":20,"prefab":6,"id":7,"X":-215},"8":{"Y":45,"t":20,"prefab":6,"id":8,"X":-15},"9":{"Y":115,"t":25,"id":9,"X":55},"10":{"Y":-225,"t":25,"id":10,"X":-285},"11":{"Y":-95,"t":23,"id":11,"X":-15},"12":{"Y":-15,"t":23,"id":12,"X":-215},"13":{"Y":135,"t":15,"prefab":3,"id":13,"X":-195},"14":{"Y":-345,"t":13,"prefab":3,"id":14,"X":-405},"15":{"Y":205,"t":13,"prefab":3,"id":15,"X":145},"16":{"Y":-285,"t":16,"id":16,"X":-125},"17":{"Y":-95,"t":5,"prefab":3,"id":17,"X":75},"19":{"rCP":14,"Y":-315,"t":1,"prefab":8,"id":19,"X":-285},"20":{"rCP":13,"Y":115,"t":1,"prefab":8,"id":20,"X":-15},"21":{"rCP":1,"Y":-225,"t":2,"prefab":8,"id":21,"X":-215},"22":{"rCP":17,"Y":115,"t":2,"prefab":8,"id":22,"X":145},"23":{"rCP":10,"Y":-155,"t":3,"prefab":8,"id":23,"X":-285},"24":{"rCP":12,"Y":205,"t":3,"prefab":8,"id":24,"X":55},"25":{"rCP":9,"Y":-225,"t":4,"prefab":8,"id":25,"X":-375},"26":{"rCP":15,"Y":45,"t":4,"prefab":8,"id":26,"X":55},"27":{"Y":-185,"t":17,"prefab":4,"id":27,"X":-305},"28":{"Y":-145,"t":17,"prefab":4,"id":28,"X":-305},"29":{"Y":-165,"t":17,"prefab":4,"id":29,"X":-305},"30":{"Y":-125,"t":17,"prefab":4,"id":30,"X":-305},"31":{"Y":-105,"t":17,"prefab":4,"id":31,"X":-305},"32":{"Y":-205,"t":17,"prefab":4,"id":32,"X":-305},"33":{"Y":-85,"t":17,"prefab":4,"id":33,"X":-305},"34":{"Y":-225,"t":17,"prefab":4,"id":34,"X":-305},"35":{"Y":-245,"t":17,"prefab":4,"id":35,"X":-285},"36":{"Y":-245,"t":17,"prefab":4,"id":36,"X":-205},"37":{"Y":-245,"t":17,"prefab":4,"id":37,"X":-265},"38":{"Y":-245,"t":17,"prefab":4,"id":38,"X":-185},"39":{"Y":-245,"t":17,"prefab":4,"id":39,"X":-245},"40":{"Y":-245,"t":17,"prefab":4,"id":40,"X":-165},"41":{"Y":-245,"t":17,"prefab":4,"id":41,"X":-225},"42":{"Y":-245,"t":17,"prefab":4,"id":42,"X":-145},"43":{"Y":-225,"t":17,"prefab":4,"id":43,"X":-145},"44":{"Y":-205,"t":17,"prefab":4,"id":44,"X":-145},"45":{"Y":-185,"t":17,"prefab":4,"id":45,"X":-145},"46":{"Y":-165,"t":17,"prefab":4,"id":46,"X":-145},"47":{"Y":-145,"t":17,"prefab":4,"id":47,"X":-145},"48":{"Y":-125,"t":17,"prefab":4,"id":48,"X":-145},"49":{"Y":-85,"t":17,"prefab":4,"id":49,"X":-285},"50":{"Y":-105,"t":17,"prefab":4,"id":50,"X":-145},"51":{"Y":-85,"t":17,"prefab":4,"id":51,"X":-265},"52":{"Y":-85,"t":17,"prefab":4,"id":52,"X":-245},"53":{"Y":-85,"t":17,"prefab":4,"id":53,"X":-225},"54":{"Y":-65,"t":17,"prefab":4,"id":54,"X":-165},"55":{"Y":-85,"t":17,"prefab":4,"id":55,"X":-205},"56":{"Y":-45,"t":17,"prefab":4,"id":56,"X":-165},"57":{"Y":-85,"t":17,"prefab":4,"id":57,"X":-165},"58":{"Y":-35,"t":17,"prefab":4,"id":58,"X":-215},"59":{"Y":-35,"t":17,"prefab":4,"id":59,"X":-195},"60":{"Y":-35,"t":17,"prefab":4,"id":60,"X":-235},"61":{"Y":-15,"t":17,"prefab":4,"id":61,"X":-235},"62":{"Y":45,"t":17,"prefab":4,"id":62,"X":-235},"63":{"Y":5,"t":17,"prefab":4,"id":63,"X":-235},"64":{"Y":55,"t":17,"prefab":4,"id":64,"X":-215},"65":{"Y":25,"t":17,"prefab":4,"id":65,"X":-235},"66":{"Y":55,"t":17,"prefab":4,"id":66,"X":-195},"67":{"Y":75,"t":24,"id":67,"X":-165},"68":{"Y":205,"t":24,"id":68,"X":125},"69":{"Y":55,"t":17,"prefab":4,"id":69,"X":-175},"70":{"Y":-105,"t":17,"prefab":4,"id":70,"X":-125},"71":{"Y":-105,"t":17,"prefab":4,"id":71,"X":-105},"72":{"Y":-155,"t":17,"prefab":4,"id":72,"X":-105},"73":{"Y":-125,"t":24,"id":73,"X":-105},"74":{"Y":-135,"t":24,"id":74,"X":-125},"75":{"Y":-175,"t":17,"prefab":4,"id":75,"X":-105},"76":{"Y":-175,"t":17,"prefab":4,"id":76,"X":-85},"77":{"Y":-175,"t":17,"prefab":4,"id":77,"X":-65},"78":{"Y":-175,"t":17,"prefab":4,"id":78,"X":-45},"79":{"Y":-175,"t":17,"prefab":4,"id":79,"X":-25},"80":{"Y":-165,"t":17,"prefab":4,"id":80,"X":-5},"81":{"Y":-135,"t":24,"id":81,"X":-15},"82":{"Y":-245,"t":24,"id":82,"X":-305},"83":{"Y":-265,"t":24,"id":83,"X":-305},"84":{"Y":-245,"t":24,"id":84,"X":-325},"85":{"Y":-115,"t":17,"prefab":4,"id":85,"X":-5},"86":{"Y":-115,"t":17,"prefab":4,"id":86,"X":15},"87":{"Y":-115,"t":17,"prefab":4,"id":87,"X":35},"88":{"Y":-105,"t":17,"prefab":4,"id":88,"X":55},"89":{"Y":-85,"t":17,"prefab":4,"id":89,"X":55},"90":{"Y":-65,"t":17,"prefab":4,"id":90,"X":55},"91":{"Y":-45,"t":17,"prefab":4,"id":91,"X":55},"92":{"Y":-25,"t":17,"prefab":4,"id":92,"X":55},"93":{"Y":-25,"t":17,"prefab":4,"id":93,"X":35},"94":{"Y":-25,"t":17,"prefab":4,"id":94,"X":15},"95":{"Y":-15,"t":17,"prefab":4,"id":95,"X":-15},"96":{"Y":5,"t":17,"prefab":4,"id":96,"X":-15},"97":{"Y":25,"t":17,"prefab":4,"id":97,"X":-15},"98":{"Y":45,"t":17,"prefab":4,"id":98,"X":-35},"99":{"Y":45,"t":17,"prefab":4,"id":99,"X":-55},"100":{"Y":45,"t":17,"prefab":4,"id":100,"X":-75},"101":{"Y":95,"t":17,"prefab":4,"id":101,"X":-75},"102":{"Y":115,"t":17,"prefab":4,"id":102,"X":-75},"103":{"Y":115,"t":17,"prefab":4,"id":103,"X":-95},"104":{"Y":115,"t":17,"prefab":4,"id":104,"X":-115},"105":{"Y":115,"t":17,"prefab":4,"id":105,"X":-135},"106":{"Y":115,"t":17,"prefab":4,"id":106,"X":-155},"107":{"Y":105,"t":17,"prefab":4,"id":107,"X":-175},"108":{"Y":65,"t":17,"prefab":4,"id":108,"X":-35},"109":{"Y":85,"t":17,"prefab":4,"id":109,"X":-35},"110":{"Y":105,"t":17,"prefab":4,"id":110,"X":-35},"111":{"Y":125,"t":17,"prefab":4,"id":111,"X":-35},"112":{"Y":145,"t":17,"prefab":4,"id":112,"X":-35},"113":{"Y":165,"t":17,"prefab":4,"id":113,"X":-35},"114":{"Y":185,"t":17,"prefab":4,"id":114,"X":-35},"115":{"Y":185,"t":17,"prefab":4,"id":115,"X":-15},"116":{"Y":185,"t":17,"prefab":4,"id":116,"X":5},"117":{"Y":185,"t":17,"prefab":4,"id":117,"X":25},"118":{"Y":185,"t":17,"prefab":4,"id":118,"X":45},"119":{"Y":185,"t":17,"prefab":4,"id":119,"X":65},"120":{"Y":185,"t":17,"prefab":4,"id":120,"X":85},"121":{"Y":185,"t":17,"prefab":4,"id":121,"X":105},"122":{"Y":165,"t":17,"prefab":4,"id":122,"X":125},"123":{"Y":145,"t":17,"prefab":4,"id":123,"X":125},"124":{"Y":125,"t":17,"prefab":4,"id":124,"X":125},"125":{"Y":105,"t":17,"prefab":4,"id":125,"X":125},"126":{"Y":85,"t":17,"prefab":4,"id":126,"X":125},"127":{"Y":65,"t":17,"prefab":4,"id":127,"X":125},"128":{"Y":45,"t":17,"prefab":4,"id":128,"X":125},"129":{"Y":25,"t":17,"prefab":4,"id":129,"X":125},"130":{"Y":25,"t":17,"prefab":4,"id":130,"X":105},"131":{"Y":25,"t":17,"prefab":4,"id":131,"X":85},"132":{"Y":25,"t":17,"prefab":4,"id":132,"X":65},"133":{"Y":25,"t":17,"prefab":4,"id":133,"X":45},"134":{"Y":25,"t":17,"prefab":4,"id":134,"X":25},"135":{"Y":-55,"t":24,"id":135,"X":-185},"136":{"Y":-75,"t":24,"id":136,"X":-185},"137":{"Y":-55,"t":24,"id":137,"X":-205},"138":{"Y":-145,"t":24,"id":138,"X":5},"139":{"Y":-5,"t":24,"id":139,"X":5},"140":{"Y":-5,"t":24,"id":140,"X":25},"141":{"Y":15,"t":24,"id":141,"X":5},"142":{"Y":185,"t":24,"id":142,"X":125},"143":{"Y":185,"t":24,"id":143,"X":145},"144":{"Y":85,"t":24,"id":144,"X":-185},"145":{"Y":65,"t":24,"id":145,"X":-75},"146":{"Y":75,"t":24,"id":146,"X":-55},"147":{"Y":75,"t":22,"id":147,"X":-285},"148":{"Y":-205,"t":22,"id":148,"X":25}}';
const KIT_DATA_3 = '{"0":{"Y":-50,"t":112,"fort":4,"id":0,"X":0},"2":{"Y":60,"t":17,"prefab":5,"id":2,"X":130},"3":{"Y":40,"t":17,"prefab":5,"id":3,"X":130},"4":{"Y":20,"t":17,"prefab":5,"id":4,"X":130},"5":{"Y":0,"t":17,"prefab":5,"id":5,"X":130},"6":{"Y":-20,"t":17,"prefab":5,"id":6,"X":130},"7":{"Y":60,"t":17,"prefab":5,"id":7,"X":150},"8":{"Y":60,"t":17,"prefab":5,"id":8,"X":170},"9":{"Y":60,"t":17,"prefab":5,"id":9,"X":190},"10":{"Y":80,"t":115,"prefab":5,"fort":3,"id":10,"X":150},"12":{"Y":100,"t":17,"prefab":5,"id":12,"X":130},"13":{"Y":120,"t":17,"prefab":5,"id":13,"X":130},"14":{"Y":60,"t":17,"prefab":5,"id":14,"X":210},"15":{"Y":140,"t":17,"prefab":5,"id":15,"X":130},"16":{"Y":60,"t":17,"prefab":5,"id":16,"X":230},"17":{"Y":80,"t":17,"prefab":5,"id":17,"X":230},"18":{"Y":100,"t":17,"prefab":5,"id":18,"X":230},"19":{"Y":120,"t":17,"prefab":5,"id":19,"X":230},"20":{"Y":140,"t":17,"prefab":5,"id":20,"X":230},"21":{"Y":60,"t":17,"prefab":5,"id":21,"X":290},"22":{"Y":150,"t":17,"prefab":5,"id":22,"X":210},"23":{"Y":150,"t":17,"prefab":5,"id":23,"X":190},"24":{"Y":150,"t":17,"prefab":5,"id":24,"X":170},"25":{"Y":150,"t":17,"prefab":5,"id":25,"X":150},"26":{"Y":50,"t":17,"prefab":5,"id":26,"X":310},"27":{"Y":-50,"t":17,"prefab":5,"id":27,"X":-20},"28":{"Y":-30,"t":17,"prefab":5,"id":28,"X":-20},"29":{"Y":-10,"t":17,"prefab":5,"id":29,"X":-20},"30":{"Y":10,"t":17,"prefab":5,"id":30,"X":-20},"31":{"Y":30,"t":17,"prefab":5,"id":31,"X":-20},"32":{"Y":-50,"t":17,"prefab":5,"id":32,"X":-40},"33":{"Y":-50,"t":17,"prefab":5,"id":33,"X":-60},"34":{"Y":-50,"t":17,"prefab":5,"id":34,"X":-80},"35":{"Y":-50,"t":17,"prefab":5,"id":35,"X":-100},"36":{"Y":-50,"t":17,"prefab":5,"id":36,"X":-120},"37":{"Y":-70,"t":17,"prefab":5,"id":37,"X":-120},"38":{"Y":-90,"t":17,"prefab":5,"id":38,"X":-120},"39":{"Y":-110,"t":17,"prefab":5,"id":39,"X":-120},"40":{"Y":-130,"t":17,"prefab":5,"id":40,"X":-120},"41":{"Y":-120,"t":115,"prefab":5,"fort":3,"id":41,"X":-100},"42":{"Y":-20,"t":17,"prefab":5,"id":42,"X":-200},"43":{"Y":-140,"t":17,"prefab":5,"id":43,"X":-100},"44":{"Y":-140,"t":17,"prefab":5,"id":44,"X":-80},"45":{"Y":-140,"t":17,"prefab":5,"id":45,"X":-60},"46":{"Y":-140,"t":17,"prefab":5,"id":46,"X":-40},"47":{"Y":0,"t":17,"prefab":5,"id":47,"X":-200},"48":{"Y":-130,"t":17,"prefab":5,"id":48,"X":-20},"49":{"Y":-110,"t":17,"prefab":5,"id":49,"X":-20},"50":{"Y":-90,"t":17,"prefab":5,"id":50,"X":-20},"51":{"Y":-70,"t":117,"id":51,"X":-20},"52":{"Y":80,"t":23,"prefab":3,"fort":2,"id":52,"X":60},"53":{"Y":-120,"t":118,"prefab":3,"fort":2,"id":53,"X":0},"54":{"Y":100,"t":17,"prefab":5,"id":54,"X":40},"55":{"Y":80,"t":24,"id":55,"X":40},"56":{"Y":-70,"t":24,"id":56,"X":70},"57":{"Y":80,"t":117,"id":57,"X":20},"58":{"Y":-70,"t":117,"id":58,"X":90},"59":{"Y":60,"t":15,"prefab":6,"id":59,"X":-430},"60":{"Y":-130,"t":22,"prefab":3,"id":60,"X":130},"61":{"Y":70,"t":22,"prefab":3,"id":61,"X":-90},"62":{"Y":-30,"t":25,"prefab":3,"fort":2,"id":62,"X":-90},"63":{"Y":50,"t":117,"id":63,"X":-20},"64":{"Y":40,"t":24,"id":64,"X":-40},"65":{"Y":40,"t":24,"id":65,"X":-60},"66":{"Y":-40,"t":24,"id":66,"X":130},"67":{"Y":-30,"t":24,"id":67,"X":150},"69":{"Y":-30,"t":24,"id":69,"X":170},"70":{"Y":-90,"t":17,"prefab":5,"id":70,"X":70},"71":{"Y":-110,"t":17,"prefab":5,"id":71,"X":70},"72":{"Y":-130,"t":17,"prefab":5,"id":72,"X":70},"73":{"Y":-150,"t":17,"prefab":5,"id":73,"X":70},"74":{"Y":-140,"t":17,"prefab":5,"id":74,"X":50},"75":{"Y":-140,"t":17,"prefab":5,"id":75,"X":30},"76":{"Y":-170,"t":17,"prefab":5,"id":76,"X":70},"77":{"Y":-190,"t":17,"prefab":5,"id":77,"X":70},"78":{"Y":-210,"t":17,"prefab":5,"id":78,"X":70},"79":{"Y":-220,"t":21,"prefab":8,"fort":1,"id":79,"X":110},"80":{"Y":-150,"t":17,"prefab":5,"id":80,"X":110},"81":{"Y":-150,"t":17,"prefab":5,"id":81,"X":130},"82":{"Y":-150,"t":17,"prefab":5,"id":82,"X":150},"83":{"Y":-130,"t":17,"prefab":5,"id":83,"X":110},"84":{"Y":120,"t":17,"prefab":5,"id":84,"X":40},"85":{"Y":140,"t":17,"prefab":5,"id":85,"X":40},"86":{"Y":150,"t":17,"prefab":5,"id":86,"X":60},"87":{"Y":150,"t":17,"prefab":5,"id":87,"X":80},"88":{"Y":160,"t":17,"prefab":5,"id":88,"X":40},"89":{"Y":180,"t":17,"prefab":5,"id":89,"X":40},"90":{"Y":200,"t":17,"prefab":5,"id":90,"X":40},"91":{"Y":220,"t":17,"prefab":5,"id":91,"X":40},"92":{"Y":-210,"t":20,"prefab":8,"fort":1,"id":92,"X":0},"93":{"Y":170,"t":20,"prefab":8,"fort":1,"id":93,"X":60},"94":{"Y":60,"t":17,"prefab":5,"id":94,"X":250},"95":{"Y":60,"t":17,"prefab":5,"id":95,"X":270},"96":{"Y":20,"t":17,"prefab":5,"id":96,"X":220},"97":{"Y":40,"t":24,"id":97,"X":220},"98":{"Y":-50,"t":17,"prefab":5,"id":98,"X":-140},"99":{"Y":-50,"t":17,"prefab":5,"id":99,"X":-160},"100":{"Y":-10,"t":17,"prefab":5,"id":100,"X":-110},"101":{"Y":-30,"t":24,"id":101,"X":-110},"102":{"Y":0,"t":17,"prefab":5,"id":102,"X":220},"103":{"Y":-20,"t":17,"prefab":5,"id":103,"X":220},"104":{"Y":-40,"t":17,"prefab":5,"id":104,"X":220},"105":{"Y":-110,"t":21,"prefab":8,"fort":1,"id":105,"X":220},"106":{"Y":70,"t":21,"prefab":8,"fort":1,"id":106,"X":-160},"107":{"Y":10,"t":17,"prefab":5,"id":107,"X":-110},"108":{"Y":30,"t":17,"prefab":5,"id":108,"X":-110},"109":{"Y":50,"t":17,"prefab":5,"id":109,"X":-110},"110":{"Y":50,"t":17,"prefab":5,"id":110,"X":-130},"111":{"Y":50,"t":17,"prefab":5,"id":111,"X":-150},"112":{"Y":50,"t":17,"prefab":5,"id":112,"X":-170},"113":{"Y":-20,"t":23,"prefab":3,"fort":2,"id":113,"X":-180},"114":{"Y":-40,"t":17,"prefab":5,"id":114,"X":240},"115":{"Y":-40,"t":17,"prefab":5,"id":115,"X":260},"116":{"Y":-40,"t":17,"prefab":5,"id":116,"X":280},"117":{"Y":140,"t":17,"prefab":5,"id":117,"X":0},"118":{"Y":160,"t":17,"prefab":5,"id":118,"X":0},"119":{"Y":160,"t":17,"prefab":5,"id":119,"X":-20},"120":{"Y":160,"t":17,"prefab":5,"id":120,"X":-40},"121":{"Y":-120,"t":20,"prefab":8,"fort":1,"id":121,"X":-190},"122":{"Y":-140,"t":24,"id":122,"X":0},"123":{"Y":-150,"t":24,"id":123,"X":-20},"124":{"Y":-20,"t":20,"prefab":8,"fort":1,"id":124,"X":240},"125":{"Y":180,"t":21,"prefab":8,"fort":1,"id":125,"X":-30},"126":{"Y":-40,"t":17,"prefab":5,"id":126,"X":300},"127":{"Y":-60,"t":17,"prefab":5,"id":127,"X":290},"128":{"Y":-80,"t":17,"prefab":5,"id":128,"X":290},"129":{"Y":70,"t":17,"prefab":5,"id":129,"X":-180},"130":{"Y":50,"t":17,"prefab":5,"id":130,"X":-190},"131":{"Y":160,"t":24,"id":131,"X":20},"132":{"Y":140,"t":24,"id":132,"X":20},"133":{"Y":-150,"t":24,"id":133,"X":90},"134":{"Y":-130,"t":24,"id":134,"X":90},"135":{"Y":10,"t":17,"prefab":5,"id":135,"X":310},"136":{"Y":30,"t":17,"prefab":5,"id":136,"X":310},"137":{"Y":-50,"t":17,"prefab":5,"id":137,"X":-180},"138":{"Y":90,"t":17,"prefab":5,"id":138,"X":-180},"139":{"Y":-40,"t":17,"prefab":5,"id":139,"X":-200},"140":{"Y":20,"t":24,"id":140,"X":-200},"143":{"Y":140,"t":24,"id":143,"X":-110},"144":{"Y":-150,"t":24,"id":144,"X":190},"145":{"Y":-130,"t":24,"id":145,"X":220},"146":{"Y":80,"t":24,"id":146,"X":0},"147":{"Y":100,"t":24,"id":147,"X":0},"148":{"Y":-70,"t":24,"id":148,"X":110},"149":{"Y":-30,"t":24,"id":149,"X":190},"150":{"Y":150,"t":24,"id":150,"X":100},"151":{"Y":160,"t":24,"id":151,"X":-90},"152":{"Y":-10,"t":25,"prefab":3,"fort":2,"id":152,"X":150},"153":{"Y":-360,"t":9,"id":153,"X":-110},"154":{"Y":-370,"t":13,"prefab":3,"id":154,"X":30},"155":{"rCP":9,"Y":-180,"t":1,"prefab":8,"id":155,"X":250},"156":{"rCP":8,"Y":-220,"t":2,"prefab":8,"id":156,"X":180},"157":{"rCP":7,"Y":-335,"t":3,"prefab":8,"id":157,"X":225},"158":{"rCP":12,"Y":35,"t":4,"prefab":8,"id":158,"X":365},"159":{"Y":290,"t":13,"prefab":3,"id":159,"X":55},"160":{"Y":270,"t":5,"prefab":4,"id":160,"X":230},"161":{"rCP":7,"Y":80,"t":1,"prefab":8,"id":161,"X":-250},"162":{"rCP":1,"Y":140,"t":2,"prefab":8,"id":162,"X":-180},"163":{"rCP":9,"Y":300,"t":3,"prefab":8,"id":163,"X":-90},"164":{"rCP":8,"Y":255,"t":4,"prefab":8,"id":164,"X":-225},"165":{"Y":-125,"t":16,"id":165,"X":355},"167":{"Y":-110,"t":10,"id":167,"X":-400},"168":{"rCP":8,"Y":-150,"t":1,"prefab":8,"id":168,"X":-260},"169":{"rCP":16,"Y":-190,"t":2,"prefab":8,"id":169,"X":-190},"170":{"rCP":4,"Y":-260,"t":3,"prefab":8,"id":170,"X":-350},"171":{"rCP":3,"Y":-340,"t":4,"prefab":8,"id":171,"X":-240},"172":{"rCP":13,"Y":170,"t":2,"prefab":8,"id":172,"X":180},"173":{"rCP":7,"Y":110,"t":1,"prefab":8,"id":173,"X":250},"174":{"rCP":14,"Y":155,"t":3,"prefab":8,"id":174,"X":350},"175":{"rCP":6,"Y":-255,"t":4,"prefab":8,"id":175,"X":345},"176":{"Y":80,"t":117,"id":176,"X":130}}';

export class popup_prefab extends popup_prefab_CLIP {
    private _KITS: Kit[];
    private _triggered: boolean = false;

    // UI elements from popup_prefab_CLIP
    public img1: any;
    public img2: any;
    public img3: any;
    public c1: any;
    public c2: any;
    public c3: any;
    public b1: any;
    public b2: any;
    public b3: any;
    public b1s: any;
    public b2s: any;
    public b3s: any;
    public t1: any;
    public t2: any;
    public t3: any;
    public tSelect: any;
    public tCol1: any;
    public tCol2: any;
    public tCol3: any;
    public tCol4: any;
    public tShiny: any;
    public tInstantNotice: any;

    constructor() {
        super();
        
        this._KITS = [
            new Kit(JSON.parse(KIT_DATA_1)),
            new Kit(JSON.parse(KIT_DATA_2)),
            new Kit(JSON.parse(KIT_DATA_3))
        ];

        const costs: any[] = [];
        let n: number = 1;
        while (n < 4) {
            ImageCache.GetImageWithCallBack("ui/prefab-" + (n + 1) + ".v5.jpg", this.ThumbnailLoaded.bind(this), true, 1, "", [n]);
            (this as any)["img" + n].addEventListener(MouseEvent.CLICK, this.Enlarge(n));
            (this as any)["img" + n].buttonMode = true;
            const kitCosts = this.GetBuildings(n).costs;
            (this as any)["c" + n].htmlText = "<b>" + GLOBAL.FormatNumber(kitCosts[0].Get()) + " " + KEYS.Get("#r_twigs#") + "<br>" + GLOBAL.FormatNumber(kitCosts[1].Get()) + " " + KEYS.Get("#r_pebbles#") + "<br>" + GLOBAL.FormatNumber(kitCosts[2].Get()) + " " + KEYS.Get("#r_putty#") + "</b>";
            (this as any)["b" + n].SetupKey("btn_useresources");
            (this as any)["b" + n].addEventListener(MouseEvent.CLICK, this.PreSelect(n));
            (this as any)["b" + n + "s"].Setup(KEYS.Get("btn_useshiny", { "v1": kitCosts[3].Get() }));
            (this as any)["b" + n + "s"].addEventListener(MouseEvent.CLICK, this.PreBuyOutright(n, kitCosts[3].Get()));
            (this as any)["b" + n + "s"].Highlight = true;
            this.tSelect.htmlText = "<b>" + KEYS.Get("str_selectsk") + "</b>";
            this.t1.htmlText = "<b>" + KEYS.Get("str_regularkit") + "</b>";
            this.t2.htmlText = "<b>" + KEYS.Get("str_megakit") + "</b>";
            this.t3.htmlText = "<b>" + KEYS.Get("str_ultrakit") + "</b>";
            n++;
        }
        this.tCol1.htmlText = KEYS.Get("popup_prefab_col1");
        this.tCol2.htmlText = KEYS.Get("popup_prefab_col2");
        this.tCol3.htmlText = KEYS.Get("popup_prefab_col3");
        this.tCol4.htmlText = KEYS.Get("popup_prefab_col4");
        this.tShiny.htmlText = "<b>" + GLOBAL.FormatNumber(BASE._credits.Get()) + " " + KEYS.Get("#r_shiny#") + "</b>";
        this.tInstantNotice.htmlText = KEYS.Get("popup_prefab_instantnotice");
    }

    public static getShinyWorthFromResources(resources: number): number {
        return Math.sqrt(resources / 2) * 0.75;
    }

    public static getResourceCostFromBuild(build: any): number {
        let total: number = 0;
        for (const key in build) {
            const item = build[key];
            const buildingType: number = item.t;
            if (popup_prefab.isBuildingOfValidType(buildingType)) {
                const level: number = item.l;
                const props = GLOBAL._buildingProps[buildingType - 1];
                const costs = props.costs[level];
                total += costs.r1.Get();
                total += costs.r2.Get();
                total += costs.r3.Get();
                total += costs.r4.Get();
            }
        }
        return total;
    }

    private static isBuildingOfValidType(type: number): boolean {
        return type !== 121;
    }

    public Enlarge(n: number): (e?: MouseEvent) => void {
        return (e?: MouseEvent): void => {
            const popup = new popup_prefab_enlarge();
            GLOBAL.BlockerAdd(GLOBAL._layerTop);
            GLOBAL._layerTop.addChild(popup);
            popup.Setup(n);
            popup.Center();
        };
    }

    public ThumbnailLoaded(url: string, bmd: BitmapData, args: any[]): void {
        if (args[0] === 1) {
            this.img1.addChild(new Bitmap(bmd));
        } else if (args[0] === 2) {
            this.img2.addChild(new Bitmap(bmd));
        } else if (args[0] === 3) {
            this.img3.addChild(new Bitmap(bmd));
        }
    }

    public PreBuyOutright(kitID: number, shinyCost: number): (e?: MouseEvent) => void {
        return (e?: MouseEvent): void => {
            const foundations = InstanceManager.getInstancesByClass(BFOUNDATION);
            if (foundations.length > 1) {
                GLOBAL.Message(KEYS.Get("kit_warning"), KEYS.Get("btn_build"), this.BuyOutright.bind(this), [kitID, shinyCost]);
            } else {
                this.BuyOutright(kitID, shinyCost);
            }
        };
    }

    public BuyOutright(kitID: number, shinyCost: number): void {
        if (BASE._credits.Get() < shinyCost) {
            POPUPS.Next();
            POPUPS.DisplayGetShiny();
            return;
        }
        const costs: SecNum[] = this.GetBuildings(kitID).costs;
        const expectedCost: number = costs[3].Get();
        if (shinyCost === expectedCost) {
            this.BuildKit(kitID, true);
            BASE.Purchase("KIT", shinyCost, "popup_prefab");
            LOGGER.Stat([41, (kitID + 1) + "b", shinyCost]);
        } else {
            LOGGER.Log("err", "KitCostMismatch (BuyOutright) expected:" + expectedCost + " got:" + shinyCost);
            GLOBAL.ErrorMessage("Expected to cost:" + shinyCost + " recalculated cost was:" + expectedCost, GLOBAL.ERROR_ORANGE_BOX_ONLY);
        }
    }

    public PreSelect(kitID: number): (e?: MouseEvent) => void {
        return (e?: MouseEvent): void => {
            const foundations = InstanceManager.getInstancesByClass(BFOUNDATION);
            if (foundations.length > 1) {
                GLOBAL.Message(KEYS.Get("kit_warning"), KEYS.Get("btn_build"), this.Select.bind(this), [kitID]);
            } else {
                this.Select(kitID);
            }
        };
    }

    public Select(kitID: number): void {
        if (this._triggered) {
            return;
        }
        const costs: SecNum[] = this.GetBuildings(kitID).costs;
        const missing: any[] = [];
        let missingTotal: number = 0;
        
        let available: number = Math.min(GLOBAL._resources.r1.Get(), costs[0].Get());
        missingTotal += costs[0].Get() - available;
        if (available !== costs[0].Get()) {
            missing.push([costs[0].Get() - available, KEYS.Get("#r_twigs#")]);
        }
        
        available = Math.min(GLOBAL._resources.r2.Get(), costs[1].Get());
        missingTotal += costs[1].Get() - available;
        if (available !== costs[1].Get()) {
            missing.push([costs[1].Get() - available, KEYS.Get("#r_pebbles#")]);
        }
        
        available = Math.min(GLOBAL._resources.r3.Get(), costs[2].Get());
        missingTotal += costs[2].Get() - available;
        if (available !== costs[2].Get()) {
            missing.push([costs[2].Get() - available, KEYS.Get("#r_putty#")]);
        }
        
        if (missing.length > 0) {
            const shinyCost: number = Math.ceil(Math.pow(Math.sqrt(missingTotal / 2), 0.75));
            GLOBAL.Message("<b>You need an extra " + GLOBAL.Array2String(missing) + " to build this kit.</b><br><br>You can bank resources in your outposts and main yard or use " + shinyCost + " shiny to make up the difference.", "Use " + shinyCost + " Shiny", this.PayForKit.bind(this), [kitID, shinyCost]);
            return;
        }
        
        if (GLOBAL._resources.r1.Get() >= costs[0].Get()) {
            if (GLOBAL._resources.r2.Get() >= costs[1].Get()) {
                if (GLOBAL._resources.r3.Get() >= costs[2].Get()) {
                    BASE.Charge(1, costs[0].Get());
                    BASE.Charge(2, costs[1].Get());
                    BASE.Charge(3, costs[2].Get());
                    LOGGER.Stat([38, kitID + 1, 0]);
                    this.BuildKit(kitID);
                    BASE.Save();
                    POPUPS.Next();
                    return;
                }
                GLOBAL.Message(KEYS.Get("newmap_sk_res"));
                return;
            }
            GLOBAL.Message(KEYS.Get("newmap_sk_res"));
            return;
        }
        GLOBAL.Message(KEYS.Get("newmap_sk_res"));
    }

    private PayForKit(kitID: number, shinyCost: number): void {
        if (BASE._credits.Get() < shinyCost) {
            GLOBAL.Message("<b>" + KEYS.Get("pop_noshiny_title") + "</b><br>" + KEYS.Get("pop_noshiny_body"), KEYS.Get("str_getmore_btn"), BUY.Show);
            return;
        }
        
        const costs: SecNum[] = this.GetBuildings(kitID).costs;
        let missingTotal: number = 0;
        
        let available: number = Math.min(GLOBAL._resources.r1.Get(), costs[0].Get());
        missingTotal += costs[0].Get() - available;
        BASE.Charge(1, available);
        
        available = Math.min(GLOBAL._resources.r2.Get(), costs[1].Get());
        missingTotal += costs[1].Get() - available;
        BASE.Charge(2, available);
        
        available = Math.min(GLOBAL._resources.r3.Get(), costs[2].Get());
        missingTotal += costs[2].Get() - available;
        BASE.Charge(3, available);
        
        const calculatedCost: number = Math.ceil(Math.pow(Math.sqrt(missingTotal / 2), 0.75));
        if (shinyCost === calculatedCost) {
            this.BuildKit(kitID);
            BASE.Purchase("KIT", shinyCost, "popup_prefab");
            LOGGER.Stat([38, kitID + 1, shinyCost]);
        } else {
            LOGGER.Log("err", "KitCostMismatch expected:" + shinyCost + " got:" + calculatedCost);
            GLOBAL.ErrorMessage("Expected to cost:" + shinyCost + " recalculated cost was:" + calculatedCost, GLOBAL.ERROR_ORANGE_BOX_ONLY);
        }
    }

    private BuildKit(kitID: number, instant: boolean = false): void {
        this._triggered = true;
        this.b1.Enabled = false;
        this.b2.Enabled = false;
        this.b3.Enabled = false;
        
        const buildings: any = this.GetBuildings(kitID).buildings;
        CREATURES.Clear();
        CREEPS.Clear();
        
        const foundations: BFOUNDATION[] = InstanceManager.getInstancesByClass(BFOUNDATION);
        for (const foundation of foundations) {
            if (foundation._type !== 112) {
                foundation.clear();
                foundation._mc.visible = false;
                foundation._mc.removeEventListener(Event.ENTER_FRAME, foundation.TickFast);
                foundation._mcBase.Clear();
                foundation.topContainer.Clear();
                foundation.animContainer.Clear();
                foundation._animBMD = null;
                foundation._animContainerBMD = null;
            }
        }
        
        for (const key in buildings) {
            const buildingData = buildings[key];
            if (buildingData.t === 112) {
                GLOBAL.townHall.Setup(buildingData);
                if (GLOBAL.townHall.health < GLOBAL.townHall.maxHealth) {
                    GLOBAL.townHall.setHealth(GLOBAL.townHall.maxHealth);
                    GLOBAL.townHall.Repaired();
                }
            } else {
                if (!buildingData.prefab) {
                    buildingData.prefab = 1;
                }
                if (instant) {
                    buildingData.l = buildingData.prefab;
                    delete buildingData.prefab;
                }
                const newBuilding: BFOUNDATION = BASE.addBuildingC(buildingData.t);
                newBuilding.Setup(buildingData);
                if (newBuilding._class === "resource") {
                    newBuilding._stored = new SecNum(0);
                }
            }
        }
        
        ACHIEVEMENTS.Check("starterkit", 1);
        PATHING.ResetCosts();
        POPUPS.Next();
        BASE.Save();
    }

    private GetBuildings(kitID: number): { buildings: any; costs: SecNum[] } {
        let buildings: any = null;
        const costs: SecNum[] = [];
        
        if (kitID === 1) {
            buildings = JSON.parse(KIT_DATA_1);
            costs[0] = new SecNum(12000000);
            costs[1] = new SecNum(12000000);
            costs[2] = new SecNum(6000000);
            costs[3] = new SecNum(420);
        } else if (kitID === 2) {
            buildings = JSON.parse(KIT_DATA_2);
            costs[0] = new SecNum(50000000);
            costs[1] = new SecNum(50000000);
            costs[2] = new SecNum(25000000);
            costs[3] = new SecNum(800);
        } else if (kitID === 3) {
            buildings = JSON.parse(KIT_DATA_3);
            costs[0] = new SecNum(200000000);
            costs[1] = new SecNum(200000000);
            costs[2] = new SecNum(100000000);
            costs[3] = new SecNum(1500);
        } else {
            LOGGER.Log("err", "popup_prefab.GetBuildings " + kitID);
        }
        
        return {
            buildings: buildings,
            costs: costs
        };
    }
}
