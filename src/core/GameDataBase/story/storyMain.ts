import {player} from "../../player.ts";
import {StoryClass, StoryData} from "./story.ts";
import {Numbers} from "../../utils/Numbers.ts";
import {Accessor} from "../../constants.ts";
import {noEmpty} from "../../utils/noEmpty.ts";

const counter = Numbers.counter(0, 1)

export interface StoryMainData extends StoryData {
  chapter: number
}

export const ChapterNames = {
  0: "孤城昨日"
}

/**
 * default:
 * ```
 * {
 *  id: counter.next(),
 *  index: "Main 0-",
 *  name: "",
 *  unlock: () => player.dev,
 *  description: "",
 *  content: [],
 * }
 * ```*/
export const StoryMainData: StoryMainData[] = [

    {
      id: counter.next(),
      index: "???",
      name: "我不知道叫什么",
      unlock: () => true,
      description: "你希望我写点什么在这里？",
      content: ["时代少年团我们喜欢你",
        "我们喜欢马嘉祺丁程鑫宋亚轩",
        "时代少年团我们喜欢你",
        "刘耀文张真源严浩翔贺峻霖",
        "时代少年团我们喜欢你",
        "我们喜欢马嘉祺丁程鑫宋亚轩",
        "时代少年团我们喜欢你",
        "刘耀文张真源严浩翔贺峻霖",
        "制作人：[player]"
      ],
      chapter: -1,

    },
    {
      id: counter.next(),
      chapter: 0,
      index: "Main 0-0",
      name: "序",
      unlock(): boolean {
        return player.dev
      },
      content: [`混乱的世界充斥着混乱。阶级分化极端，自然灾害频繁，许多移动地块组成了城市，而灾害来临时，地块四散溃逃。这便是苦难的时代。`, `社会分成的三六九等，以施术能力定义。每个人都会经历施术能力测试，能或不能，决定了人的未来。常能见到欢呼雀跃着奔走的人，拥抱自己的家人，或是垂头丧气，仿佛人生已看不到希望，便只能失落地踱步，和被迫做出流浪荒野或进入"弱窟"，一种弱者的集中营。没有施术能力注定受到不公的歧视。历史上也有不少的残断者成功改变了自己的处境，无数的残断者只是盲目相信，拿着最少的工钱，干最脏最累的活，住着破旧的房屋或风雨于街头——而这类的街道是常无人看管的，什么事都有可能发生，这是烧杀劫掠着的天堂。没人管，弱屈的治安机关常是无用的，虽有些地方的，政府会管一管，但被歧视的根源是无从改变的。术者总在为残断者构造梦想，而他们穹尽一生都无法完成——但那些人依然不停下。`, `然后？残断者人生没有然后，从出生被寄予希望，六七岁的测试分出了初等学校，十二三岁的决定了绝大部分人的身份——傲视他人或愤郁离去。没有人想象的了，残断者儿童在荒野无目的地行户走肉，或者死于野兽天灾，或者被城市守卫击毙；或是在弱窟中干一份工作﹣可能有人在乎他们的年纪，安排些轻活……但没有人在乎，哪怕是一丝怜悯与同情。所谓的公益就是个笑话，没有人寄予希望，因为注定破碎。`, `但儿童，新生命会带来希望。子女成为了术者，父母甚至祖父母都可以离开弱窄，得到哪怕一丝的改善。所以一个家庭两个孩子的机会便尤为珍贵。`, `就是这样残酷而有序的世界，运转地无情，而终有变数。`,],
      description: "有人亲眼见证世界。有人却无望。",
    },
    {
      id: counter.next(),
      chapter: 0,
      index: "Main 0-1",
      name: "苦往",
      unlock: () => player.dev,
      description: "过去：痛苦或追忆，而废墟中爬出的是不甘的希望。",
      content: [`"请全体人员回到建筑物中，避开A03~B21各区分裂地块，应急通迅与求救接276.17,全体人员清注意……"警报声毫无征兆地响起。睡梦中的残断者们才被惊醒，听了见着外面的黑夜，便又在喧嚣中倒头便睡。`, `芸也是如此。她早已对这种迁移见怪不怪，等上面在弱窟里发警报的时候灾难基本也不远了，要么死要么接着活。沉重的生活已让芸耗尽了所有的希冀。她有一家理发店，从十二岁当学徒干了几年，耗死了孤寡的店长拿下了这家店。虽然理发店在A区仅有三家，生意也并不是特别火热，甚至另外两家几乎不再营业，芸还是坚守着。毕竟年纪轻轻便得到了一个自己的店铺，每日不算务（相比而言）的工作，有时间写几首小诗，可能还被巡查注意到传播一下；存一点小钱，尚能孝顺自己的父母。`, `和弱窟中绝大部分人相比，芸是幸运儿中比较不幸的。女孩子毕竟相比弱小，便不时有混混过来讨钱。小额确有困难的，芸经常当好人；当然也许能得到一点回报，但更多此生便不再见了。啊，日子该过的帮一把，这是芸在黑暗中仅能带去的光明了——即使少。"哦哦哦？哦哦上哦→了"震动感从"床下（不如说辈子下）传来，地块开始移动了。不出意料，又有一些违章建筑坍塌了，传出人的惨叫或是救命"。芸无奈地坐起——这动静换植物人都能震醒，睡不着便看着街外的星空。暗黑的夜晚其实也没有几颗星，在这个时候的。s 只剩无人曾至的绝境能见到满天星了。黑云的边郭翻滚着，风正呼呼地吹着，便常有电线在空中摇曳，然后转圈或倒下、停电。`, `"哐当"几声，地块似乎经过了一个大坑，一次跳动后便有明显的倾斜。看来刚过了一个挺大的坎，你打算睡？"一道声音传来。"算了。看着吧。还有电吗？"随着开关声，靠近云的地方亮了。"随便你，我回去睡了。"芸打了个哈欠，应道："晚安，我摸一会。"`,],
    },
    {
      id: counter.next(),
      chapter: 0,
      index: "Main 0-2",
      name: "恐慌",
      unlock: () => player.dev,
      description: "兴——百姓苦；亡，百姓苦。",
      content: [`地块停下了。昏睡的芸从梦中被地扶刹车的紧勒感痛醒。出到街通上，却有种莫名的冷清。有一些房子前出现了人，地块边像上也有人坐着。大家似乎都无事可做，往日干活的口号不再响起，巡查也没有上街——就像一座死城。太安静了，除去动物的杂音和呼啸的风声，"人"反而死寂了。`, `过了一会，响起了一段舒缓的音乐。人们正沉浸其中，或想着上面竟然还会放这种东西；有人走在街人摇头晃脑，也有人从高处（窗户）探出头来寻找发生了什么。芸却感到了一丝不对劲：有些音极不和谐的低了半个调，有种诡开的氛围。`, `不出意料，广播中响起了某位管理者的声音："各位市民，早上好。昨日发生了我们最痛恨的事；邻国拒绝了我们的避难需求。向来我邦和待他国，却遭遗弃之举，甚于对边境数地块发生冲突。我们绝不服软，绝不认输。时令01A-2307-F0已生效，请各市民潼从政府部门安排。"`, `声音消失，街道上陷入死寂。几乎所有人都愣住了：时令F0已经够吓人了，甚至还是01A,说明战事将要来了。在这个平均年龄27的地块，响起了许多人的悲鸣。许多人仍希望自己能有个灿烂的青春，但遗憾的是，这已不再可能了。`, `街道上又充斥着痛哭。有人无目的地奔跑，有人从楼上坠落，有准备离开地块归依荒野的——一幅恐慌之景。芸很幸运，自己和父母都不在第一批征名之列。征名，说的好听，但在弱窟就是赤裸裸的抢人，征名的人跑也不是，留也不是——荒野和监狱，或是搏击"强兵"这一个光荣和提高地位的名号：决择，苦痛与别离。`, `无人在意，野火已住在地下被点燃。`, `漫山遍野的荒梦，将于终日焚尽`],
    },
    {
      id: counter.next(),
      chapter: 0,
      index: "Main 0-3",
      name: "野火",
      unlock: () => player.dev,
      description: `■之梦，■之火。"我不愿看见，一切苦难与痛恨。"`,
      content: [`芸知道，火种已然滋生。`, `和往日一样，芸在店中给人理发。一个衣着奢华的人走了进来，"店长呢？给我出来。"她趾高气扬的样子令芸感到恶心，但见过许多顾客的她，已经习惯于形形色色的弱智了。"你好，请问有什么事吗？"但尽力忍耐的平静并没有换来什么。她更大声地叫："你听见了还不过来迎我？"她又环视一周没找到一个比较干净的椅子，"什么破地方，连把能坐的椅子都没有。"`, `这些活激怒了座椅上理发的人。他猛地站起来面对那人（并吓到了芸），离目圆睁地骂："这地方没你脑子破，穿这么有钱怎么不去别地，来这里搞事干什么……"芸伸手拦在他面前，"好了好了，都别吵了。"将他赶远一些后，"这位女士，我这里可能破了些，如果嫌弄可以离开。讲个先来后到，好吗？"`, `那女的明知自己不占理，瞪大眼睛想说什么，却最后咽了回去。芸略高的身形让她心中愤怒更进，f摆下一句"你等着吧，你给我等着"便走了。男人从店后走回，拍拍芸的肩膀，略带欣慰地说："可以的，我刚刚着急了，给你添麻烦了。"芸难为情地笑了笑："开启的，总归别闹嘛。等会不然我们都要出事。"`, `再理完发，男人向她告别。"有事来找弟兄们，一定帮你！"`, `片刻的闲适后，那女人．又？卷土重来。"就这里，砸。"一伙人冲拥而上，将后中可见的都蹂躏了一遍，而芸跑回店后拉了帘门躲在后面。可惜店——人仍在。帘子大概很坚固，直到店中没了什么动静，芸才敢再出来。店中已是杂乱不堪，木椅子裂成碎块，镜子（玻璃碎片）散落在地上——之外便还好，店中再没有什么值钱的东西了。`, `芸跌坐在地上，不知所措。门外聚集了一些人，有人摇头叹气，有人紧握双掌、愤愤。不平。也有人走进店中，收理起杂乱的残渣。那些常和芸来往的人便上前安慰。但芸只觉得天要塌了。这家小店渗注了芸近半生的心血（与老师傅的一切），而现在几乎被人毁灭了。椅子，镜子都是老师傅生前门制的，即使做工粗糙也花了不少价钱，现在难以搞到了。为什么？为什么是我？为什么我如此心会这个世界（最不济也是这个地块），还要经历如此苦难？命运为何不公？凭什么是我？凭什么……`, `数小时后，昏迷的芸从睡梦中醒来。街上的老医生守在一旁，父母正盘坐在地上，脸上写满了焦急与慌乱。看到芸坐起来，父母立刻上前想说什么，但被老医生拦住了。摸了摸芸的额头，把了脉，终于点头让父母前来。`, `芸刚要张口说什么，被母亲一把抱住："宝贝，委屈你了，啊——不哭不哭，宝贝别哭，"揉了揉芸的脸，泪水已经浸湿了脸颊，"爸爸妈妈永远支持你。"父亲坐在芸背后，只时不时摸摸芸的头，拍拍背，顺便像儿时一样给女儿偏了一头辫子。`, `"呜……"只能哭了，可怜的小女孩。心中有熊熊烈火，但她无能为力。`, `第二天醒来，芸照常下到店中。挂上了几个淘汰（但勉强能用）的镜子，拖出唯——。10个理发卖，大概摆好了一些，又重新开张营业。听着收音机中讲着前线的战火，芸心中突然一动。虽然现在她不常听了，但当她听到对术者一顿夸时，她生气地关掉了收音机。"去他的，天天捧这些破人，觉得我们都扔成灰生了？"`, `不久，便有人来了。来者是报社的小编，经常来找芸拿诗或者聊天。看到店里突然变得这样破乱："怎么了？看你人不太好的样子。"芸苦笑道："店给人砸了，也没停了，我大抵是1，好不起来了。"她上前抱了抱芸。虽无言，但人心相通。`, `按照之前的样子为她理完发，二七便离开了。临走时，二七留下了一个电话："对了，我想你会在何时需要它。接着。"芸接过一看，是一张很简陋的卡片，只有一张火苗的图片和一串号码。`, ``,],
    },
    {
      id: counter.next(),
      chapter: 0,
      index: "Main 0-4",
      name: "相遇",
      unlock: () => player.dev,
      description: `"是致是友，你自知。"信任与危机，机会只在一瞬间。*风雨际会。其如是发端，于无处不尽。*`,
      content: [`芸选择歇一天。过了将近一周，芸还是没有走出来，便选择了出去玩一天。在A13约了几个朋友，却只叫出来一个星。在地块边乘电梯下到地面，二人骑自行车到不远处的小山丘上观景。早晨出发，此时已经将近中午，放下车，打开包，铺下垫子，便开始休息。`, `星体力有些不支。在地块内基本不接触体力活的她，此刻已经面色通红，上气不接下气了。"扑通"一下躺在垫子上，星长叹："好累啊——"如此躺了一会，星问："芸姐，你不累吗？"芸从地上站起，手中拿着一朵白花，"你大娇贵了吧。多干干活，干文职怎么体会人生？"星翻了个身，一头埋入大地的怀抱："算了，以后你载我好不好？"向芸摆了个（看似）同爱的表情，芸扭过头做干呕状，表达了强烈嫌弃。`, `星白了个眼，走到芸身边。拍了拍芸的背："不知道现在还怎么说。……希望你尽快走出来吧。也不太会安慰你了。乡亲们都会是你的后盾的。"芸回头向星苦笑："说得…好吧谢谢你们的好意。唉——"长叹气，芸看向无限远方，眼神中有种迷茫与无措。双眼并不那么有光——而星也注意到，那常在嘴上挂着的，（算是）地块一道风景的笑容消失了。芸心中仍是一团糟。或许吧，这一次打击让她变了，不再能如何乐观地对待......而她曾是众人的骄傲，老师傅的传承（学徒），小至孩子们的"姐姐"，她总认为她背负着不合理的太多东西。心有万哀无处发，便作双泪颊上滑。星云遮光敝日处——可惜。二人注意到远处正来临的乌云。出发前二人看了天气，并没有雨的提示：可云的确就在那里，慌不摔路之际，二人躲进山侧的林子里，捡几根树技，选了个不易积水的地方，便架起垫子，清理了一下地面，席地而坐。`, `"我不嫌脏，你随意。"芸直接坐在一个土包上。幸亏二人来得早些，此时便有淅淅沥沥的小雨下了起来。树叶沙沙作响，不时有几只蜻蜓或虫子飞进这里，林子中也不。见其它动物。灌木丛也沙沙作响——`, `"等下，有人。"芸带着星伏下，倾听着声音的来源。星仍是一头雾水，还没反应过来便被芸拉下，险些没稳住摔在地上。"怎么回事？"星害怕地问，正不断吞着口水——惊张的氛围下，芸没有回答，而是用手势和眼神让星先诠静。只是这黄色的垫子实在太过`, `显眼，星也很快查觉到了。"啊——"星嘴中蹦出一堆不规则的发音。她们都记得，以最大恶意揣测陌生人。"别叫"，芸轻捶了一下屋的脑袋，"保持镇静。"`, `来人显然发现了这里。"哗啦声渐渐涌近，二人的心也提到了嗓子眼。`, `"借躲一下，可以吗？"那人走近，二人才辨出是一个好的脸。眼睛不太大，而是相对扁而修。长，睫毛异常地长，大抵是贴了假的。鼻子并不高，也并不突出地嵌在脸上。嘴唇薄红，有明显干裂。头发扎了马尾垂在后脑勺下，刘海（像刻意所为的）参差不齐，让芸犯了职业病。脸上肉不多，肌肤有光但颠侧有痘印。脸上流淌着雨水，（也许和汉水）打湿了头发。白色衣服，紫黑色外套和长裤，让两人感觉……有些帅？`, `"来吧。"芸伸手邀清对方，眼中仍是克制与戒备。那人坐下，便举起双手："我不是来杀你的，我…那个…算了。"她放下手，"我叫瑕亘，王字旁的清假的假，亘古长明的亘。你们呢？"`, `星先回答："星，单字，星星的星。这是……"芸打断了星："芸，叫云草就好了。"`, `瑕亘放下了背包。她看到芸眼中再次出现的紧绷："不是刀，不是炸弹啦。"她拿出一条毛巾，盖在身上。粉色的，有几只兔子的缝饰。"我冷啊！"`, `芸和星相视一笑："好好好。你怎么跑这了？"`, `假亘两手抱住膝盖，缩成一团："我从泽云亭，就阔兰那边，"见两人摇头，"中南部那边啦。反正也不会是什么好地方。"从兜里取出一个像钱包一样的东西，拉开拉链，从中取出了两张卡，递给了芸："另外，我从二七那里了解了一些你的故事。"在芸惊讶的眼神中，"我们有一个地下反抗——不是，什么反抗——推翻术政，建立平等世界的理念。"`, `芸愣了一会，反应过来："所以——二七也是你们的成员？"`, `瑕点点了点头。"的确。对了，我们火种——高和你们介绍了，除了以上目标，还实际运作着一家公司，也相当于我们的据点；末式公词。当然你不大可能知道这个名字。不过，起码是合法的公司，设在特林那边，就比较"自由"——你懂的嘛。"`, `星好奇地问："我呢我呢？"`, `瑕亘摇摇头，摆出一幅父母训斥小孩的威严样："你还不行。你没有理由加入。"。`, `芸若有所里地望向远方。"所以，二七给我的那张卡……""是我的号码，"瑕亘摆了摆手，"是这样的。我呢，在明面上是公司领导人，下面就是组织领袖。——不能再说了。若不是二七向我提到你，大抵是不能告诉你的。"`, `星脸上浮出伤心。"好吧，芸怎么说？"转头看向了芸。`, `芸心中又是一团糟。"火种"或者末式，虽然不当员工——这样说，"可以加入你们的同时，像二。七一样在这边工作生活？"瑕亘挑了挑眉："不错。当然我们也会在特殊时期调动你们。正常不会有什么给你们的任务，可以去问二七。"`, `详细的回答，让芸（可能，某种程度上）下定了决心。`, `"为共同的理念而战吧。"瑕亘伸出手。`, `芸迟疑．了一会。"我啊……"，伸出手，"嗯。"`, `星像饭局上的小孩不知所措。瑕亘看出来后，摸了摸星的头："你到时便知道了。"`, `相聊了一会，雨渐渐停下，运方景色也渐渐清晰。虽然太阳还是躲藏着没有出现，但在云后某处，注定闪亮荣光。`, ``],
    },
    {
      id: counter.next(),
      chapter: 0,
      index: "Main 0-5",
      name: "荒野",
      unlock: () => player.dev,
      description: `草原，无人顾暇，终归荒野。*野火肆虐，留下的只剩哀鸣。*`,
      content: [`芸总归过上了相对平静的生活。除去火种的一些信息，芸便几乎没有接触到外面的世界。战争已经连绵四个月了，这座离前线不到50公里的城市竟安然无意，实在的，并不是很让芸感到放心——不过并不常需担心。至少对一个普通的女孩而言，这几乎是一切。`, `午后时光，芸坐在桌前，泡了几盏茶，惬意地喝着——有些苦涩，让芸脸上不时显得有些5扭曲。但这种茶受欢迎于回甘，也许和清酒一样，后劲大，至少芸如此认为。`, `此时有人推门而入："早安，芸姐！"芸闻声抬头，星穿着一件粉色外套走进，还不忘拉着衣链转两圈展示俗芸看。芸没见过星这样，倒是先不慌不忙掏了口茶："今天这么高兴？"`, `星拉了个椅子在桌旁坐下，顺便拉了拉衣角，与芸相对而坐："是呢，看我衣服，怎么样？嘿嘿"芸看了看自己穿的衣服。这件灰衣服已住洗得发白，但白得略有规律﹣自下而上变淡，却比原来更有一丝美丽。显然芸也很久没换过了。其实她本打算后些日子去挑，只是碍于最近肃查多不好．出远门。`, `"姐，"星拿起茶杯抿了一口，脸上表情逐渐扭曲，"你们那个火种现在怎么样了？"听到这，芸拿起通迅器，"哎，不对，"芸一拍脑袋，"明天，不是——过会有个无线会，我给搞忘了。"星眼中流露好奇："可以让我也看看吗？"芸打算一口回绝，但看到星脸上的一点委屈，还是妥协了："那行吧——但你别咬声，听就好了。"`, `待到下午三点，通迅器传来振动，芸放下准备倒茶的茶壶接通了会议。断断续续的一段杂音过后，传出一句人声："请各位稍作等待，会议马上开始。"芸不慌不忙悯一口茶，星脸上浮出了激动之色。`, `"线上的同志们，下午好。我是会议主持人，瑕亘。"二七从阳光下推门而入，拿出通讯器摆了摆，芸也拿起示意。"那么今天是一个组织迎新的会，不会占用大家太多时间。主要是和大家介绍一些东西，包括应该注意的静默要求。"二七看着星，又看了看芸："呃……她应该？"芸摇了摇头，"不用。"`, `和意想的差不多，是一些纪律什么的，大概是一些令人厌烦的东西。星听些觉得无趣，一会便扭头看向外面，或解开衣领扣子又扣上，一会踮脚尖撑着头发呆。二七向云看去，眨了眨眼，芸回以无奈的眼神。`, `瑕亘的声音停住了，传几声男性咳嗽的声音。星眼中一下子有了光，竖着耳朵满怀期待地听着。那个男的开口便震住了几人："假亘和你们讲了许多，这些是你们以生命为抵扣的。大家都有一样的苦衷或期望，我们不希望被背叛——这些东西不应让他人知晓。在瑕亘讲的之外，绝不要质疑我们的力量，除非你想少活几天，否则守住嘴。"`, `星愣了愣，看向二七，又转向芸，手指着通讯器："啊……呃一？"`, `芸心里一下变焦灼了。感觉自己连累了星，但又为星担心："你也别。"随后作了个嘘声的手势。二七往椅背上一靠，望着天花板一言不发。`, `星眼眶逐渐闪光，但又压低着声音，捏着鼻子不让自己抽泣。芸此时只能无奈地摸摸星的头发。虽然芸也不知所措。`, `瑕亘又开口了："大家也听到了，所以请不要浪费生命去做一些没用的事，"语气不同往常地严肃，"那么今天我们就到这理，请抿霖附近的同志切至另一频道。"`, `芸看向二七。二七回答："切到0.73.2，接入密码是抿霖拼音。"`, `芸坐到星旁，拍了拍星的背："不怕不怕，吓唬你的。"但星呼吸逐渐规律，"睡着……了？"芸表情一下缰住。二七笑着摇了摇头，"算了，咱们去后面聊。"芸起身，到店门口闩上门，便进到小房间中。`, `狭小的空间规划还算有序，上下铺的架子经过改装，上面睡一个人，下面则是一个桌子和衣柜，整体很是紧凑，不过灯下的一瓶绿植——芸也差不多忘记了它的名字，鲜绿地突兀在一片灰白之中。．当初店长把这里置作仓库，自己住在楼上，不过芸将父母接了过来，那间旧房子是租出去了还是怎样。`, `二七席地而坐，芸则坐在桌旁，先给绿植喷了些水。"你这个……玩意养了多久了？"二七指着问，芸抚摸着它的叶子，"年初我去外面野游的时候觉得不错，至少挺吸引我，然后挖出来这儿了。"`, `暇亘的声音响起："二七，芸，收到清回复。"两人简单应了一声。"好。那么你们，和E区的几位可以先认识一下。我们在抿霖有近二十人，在近几天我们要聚一聚。当然，几位记得骑个车。"随后声音一顿，"别忘了带一些伞和吃的。"`, `芸表情变得疑惑："?"二七耸耸肩，"她是经常这样，有时候一些行为很迷惑。当然你要习惯一下，她是这一片的老大，我们一般都听她的，起码她的行为只是迷而不是令人反感。""那我们要不要准备一下？""那用不着，带点肉干顶饱的东西就行。这真的只是聚一下，更像事实上的茶话会。"`, `把通讯器收进衣柜一角，二人出门来到桌前，芸敲了敲星的头，后者迷迷糊糊地醒来。二七一脸无语，"真睡了啊。"芸淡淡地笑。`, `三日后，芸收到了瑕亘的信息——过两天聚。`, `六日后的清晨。芸伸一了个懒腰，手撑着天花板。下床洗漱，简单梳妆打捏便出了门。骑上车，检查了一下链子，戴上帽子便出发。天阴着，云朵却并不浑浊。芸很喜欢这种日子，不那么晒，也不像雨天闷凉，是一种恰到好处的舒适。——至少陈了芸，大家都不大喜欢这种日子。骑了二十多分钟，芸看到了几人向她这看，一人伸高了手，然后几人都伸出手来。视野逐渐清晰，映入眼帘是数个男女，衣着不一，站姿各异。一看，芸发觉自己是这里年龄大概最小的。5 在一旁放下车，芸背着包向他们走去。瑕亘早到了这里，坐在地上与几人谈聊。其余的向芸打了个招呼。看到芸，瑕亘起身走近："啊，咱们最小的孩子来了。"芸回以一脸微笑，然后将包放在一边："真是，大家多多关照。"众人似乎都对芸很感兴趣，组织吸收的新人久没有这样年轻的了。"二十几呢？"有人问。"十五十六。"芸随口回答，便震住了几乎所有人。有人问暇亘："我们还招童工？"瑕亘摊开手，"不全是，如果她自己愿意讲。"`, `2。 与众人交谈了一会，人也陆陆续续来齐，有人问"这小女孩谁家的"之类的问题，芸一开始象征性地解释，后面自己懒得说了便只给一个笑脸嗒两声。瑕亘见人差不多齐了，便招呼众人围成一圈。像小朋友聚众丢手巾一样，大家便坐在地上，或将包里的食物拿出，或在地上垫一块布。草地上变得色彩点点，尊果的蓝与黑，肉干的棕，一些芸不认识的黄色，草地的绿色。`, `"那么大家来了。这次聚，与上次一样，"迫开，目光扫视周围一圈，"我们又新加入了五位`, ``, `芸:`, `同志，其中有一位16的——""15啊。"芸开口，"15的小同志。"几人略睁大了眼，但很快又收了回去。"然后是一个传统环节：新人们介绍一下自己吧。"`, `一人先站起来："各位好，我是诚严，诚实的诚，严格的严。我定居B13，现在以一些文活为生。希望大家接纳咱这些新人，我们也会争取大家的认可的。"有人点点头，也有蒋信将疑的目光。芸便随其后，撇了撇裤上的杂草："大家好，我叫芸，草字头的芸，可以叫我草云。刚刚瑕姐也提到了，我今年15，比各位小一些。我在A13,"头转向诚严，"咱们挺近，现在经营着一家理发店。各位方便也可以来这边，我都在的，"浅笑一下，便坐下。`, `后三人，B17的晓雅，C18的琳昔，D08的西姚。`, `瑕亘吃下一条肉干，"五位新人说完了。当然，这次没有什么正事，一对了，附近的局势不那么好，各位还是小心些。大家都有许多吃的，聊聊吧，大家认识一下。"`, `头顶上没有云，几人也未晒着。远处太阳温和，气温并没有上升多少，依然温和而舒夷。众人渐渐打开话闸子，从有些拘束的腼腆放开自我。从喜欢的饭菜到理想型，从生活小事到针眨时弊，天马行空的思绪展开，充满了快活的气氛。`, `直到瑕光大声说："各位，地块有传合，大家清赶回去。聊天咱们可以用通讯器，这次小心点，AD1到C18的小心些！"而后起身拿着通讯器，一脸紧张之色踱步。人们查觉到一丝不妙，也纷纷收拾东西动身。芸背上包，正准备去骑车时，诚严拍了拍芸的肩——后者像受惊的猫向边上一闪，而后认清了人又放下了防备的手。"这么害怕？"诚严叉着腰，一脸无语地间，"我很像会吃了你的样子吗？"芸没好气地回应："也没认识你多久吧！"而走到车旁，正跨上车，诚严补了一句："明天有空，我去你店里，有事，拜。"便走向自己的车。芸有些话，却塞在嗓子里，只好骑上车赶回。`, `急忙翻过几座小坡，远远地便听见了喧闹声。平日即使大家都在街上，也难有这样的声浪。便有些不好的预感，加快了回去的速度。却不小么绊在了石头上，车连着人向一旁摔倒。眼中舍泪，从地上坐起来，翻出包里的一块棉布擦了擦伤口的血迹，向远方望去，`, `彷佛火焰开腾，草木动摇，只剩动物的哀鸣。`, ``,],
    },
    {
      id: counter.next(),
      chapter: 0,
      index: "Main 0-6",
      name: "纷乱",
      unlock: () => player.dev,
      description: `旗子指向无相的远方，随波的人们逐向虚无。`,
      content: [`芸见局势不大妙，折起单车从一条小路回到了地块。推开爬满藤蔓的门，嘈杂声便一下大了起来。绕回小店里收好东西，便爬上二楼，向前走到窗边观望。`, `"爸，发生啥啦，这么大动静？"芸眼光四处顾望，看到对面窗子里有人也在张望，问一旁的父亲"喏，你看那边，"手指向靠近A14的方向，"刚有人搞事，然后转移到那边去了。"父亲叹了口气，"刚差点搞了你这，多亏你老妈下去拉了卷帘。真是，"一脸可惜之色。芸追问："啥？搞什么事了？"母亲声音从背后传来。"嘿，宝贝，回来了。"也走到窗前靠着芸，"有人要搞叛乱，一堆人从叩到18的，几天前好像过来了﹣那个小屁崽子，今天抗大旗游行，""不只，他们也有武器，"父亲补了一句"事实上，暴动吧。"母亲又跟上："得，那个意思。朝着中心区去了。"`, `芸惊讶了一下。"往中心区？什么样的旗子啊？"`, `父亲又叹气："唉哟，不记得了。这是要搞革命啊。"`, `"革命"这词，对芸来说挺是遥远。曾经，也是许久的糊状的记忆中，在《婉珥》社的一些淡历史的栏目中见过。如今似乎确实要发生了，芸心中有种五味杂陈的惋惜。`, `"哎我——"远处似乎传来爆炸声。不久，刺耳的警报声响彻，昭示着"恐怖袭击"的来临。当然，O1A-FO之后，城里近半活龄去参了军，也没多大的声响。父亲不慌不忙在一旁泡了些菜。母亲也坐到桌旁，拿了一张报纸开始看。芸也些着有些无趣，便下了楼回到小房间。`, `通迅器闪着灯。芸拿起来看了看，有诚严的几条消息，和瑕亘，二七的通话。正要细看消息，二七对来通话。"天，你可安于接了。这么大事，现在回店了吧？"隔着都能听见二七的着急。"嗯那，所以怎么了？"芸问。"哎，服了你，"二七叹一口气，"弑梦潭知道吗？这群人——""不知道。""不管，反正是比我们激进一些的反动分子。你可别干什么事，如果他们闹大了，再听组织安排，一定别乱弄啊！"`, `。芸挂了电话。心中有些快忽。至少，报自己的仇说不定也便成了。有点小期待，却又有些不得参加的遗憾。警报依然高昂。`, `街上仍没有什么动静。流浪的猫狗不知所措地来回奔跑，忘记了相互追逐啃咬。冒烟的天边没有什么变化，只是倚留观望的人。于是芸回到底层，像平日闲暇时坐在桌子后方，沏一壶茶，便写一些诗作：`, `如你的梦／晚舟于湖中浮动／眼底映满天星空／如我所见／烈火焚尽了荒原／脚下的未来满陆／流逝之水／一叶舟中人／望天边、烈焰／残垣新壁／一片危墙下／映镜眼无光`, `灵感一跃，行云流水地便作了一首。即使她不太愿意给别人看，但奈何已与二七成了要好的朋友。此时也无事，便拉开卷，帘门，走上街去。`, `猫狗又恢复了往常的平静。显然，已经没有什么动静了﹣也许弑梦谭失败了？而又转。向行于辰思之路，为残断，"普通人"而憾然。她总会想到爷爷曾讲过，近百年前仍是一个没有什么差别的世界，人们并不因持有术力而认为自己高人一等——可直到一次选举，政府再无普通人，而这个国家彻底沦为了一个冷酷的权力机器。芸总想体验那样公平的生活，如从所愿，却只是术力为普通人留下的最后一丝虚假的希望。可芸无力。她却很切于知道这场动乱的最后结果——至少让她混浊的恩绪安眠。`, `向中心区靠近，而动静也越来越大——所以尚未结束。芸环顾四周，凭一些过去的记忆找了一条上到附近楼顶的小路，几下登上房顶，观望着中心巨的情况。硝烟并没有刚见到的那么浓烈，可见的只有几栋楼正有燃烧，路上时不时有人影从四面向中心区那栋大楼，珉霖的政府大楼赶去。不时传来人的叫声，或是受伤的哀鸣，害怕无助的颤抖，也有守卫的威慑与攻者的呼号。`, `芸站在楼边，扶着栏杆，脚踩着无人打理的野草，不觉便将日落。通讯器从兜里传来震动，芸看了一眼，是诚严的电话。`, `"喂？——芸，你在店里吗？"诚严从那一端传来疑惑，"敲半天了。"`, `"我在中心区。过去凑个热闹。"芸如是回答。"这么大事，怎么不看呢？有什么问题吗？"`, `"我看你早上不回，以为你有事，问暇亘也说不知道，真是让人急得，唉。"`, `"和二七打了。不用在意。我现在回去，等我一会。"芸挂断了电话。`, `so从梯子上下来，芸向中心区望了一眼。狭窄的巷中，只见天边红光与淡烟。晚霞、还挺好看。芸如此想着，向店走去。巷角的野花在风中摇动。`, `几分钟后，芸回到店门口，见诚严在路边坐着，看着已等候多时了。`, `"嗨呐，终于是回来了，让我等死了。"诚严一手撑地，从地上站起来，"可以，让我进去聊会吗？""喂哼，"芸从兜里掏出钥匙，抬起卷帘门，挂上营业招牌，推开门进到店里。"来，自己找个趁眼的椅子坐吧，柜台后面没了。"`, `"行，"诚严便找了个靠近柜台的椅子，落生与芸交谈，"你刚在那边看完，大概什么个情况？"`, `"芸眼皮略抬，"早上他们应该是游行，然后干成了暴动，现在中心区和政府大楼还有事，他们人不少，看着葛谋已久了。"然后提了提荼壶，"嗯——已经攻进楼了，然后剩下我不大清楚。死了几个吧﹣不过还没有术者加入，没看到施术痕迹。你要的话，这里还有茶。"将一个茶杯放在柜台上。"■"看着不错，早看那群人不爽了，真是替天行道啊！"，成严一幅畅快的表情，向后一靠差点摔倒。`, `两人通迅器同时响起。芸习惯性低咳加以掩盖，但意识到这里没有别人，又拿出来了——诚严笑了笑，"还真是谨慎呢。""别管。"芸白了诚严一眼，后者脸上故作委屈。`, `是瑕亘的通话。一接通，瑕亘便急忙呼唤："各位，回家待好，现在珉霖有军队来了，在E18东北方向几公里，做好保护，收到回复！一定保护好，这次事真不小！"仿佛瑕亘像火灾时的初校老师，担心哪个孩子没能逃离。`, `二人相视一刻，按下了回复键。"看来——"芸伸了个懒腰，"要出事了哟。"`, `1s没多久，机械的声音从B14方向传来。显然，这次事件已住超越了游行其本身，那么被如此处置便也不奇怪了。"可惜，有那么一点希望吧——不过拖了太久了，没能速战速决大干一场。"诚严一口饮尽了杯中的茶，"天，你这茶真是——好苦啊。"将杯子放回柜台上。`, `"但是个好头。说不定你们月后也能这样干一番大事，然后解放我们呢？"芸眼底仍有一丝希望。`, `"只愿瑕亘来得及让我们加入吧。"诚严转向外面，里面街道对面。声响仍从耳朵右方不断，传来。"起码我们可以做出改变，我们有能力去改变——"眼神漂冽之下，从手心燃起一丝火苗——令柜台后面的人大吃一惊："你……是术……""不完全是。有种小技巧。你不是术源排斥吧？"得到肯定回答后，"嗯，你可以尝试像那时所教的，心里加上几个字，"又在另一只手心燃火，但很快变小了。"事实上呢，总的时间不能维持太久。这大概是火种一个比较有价值的东西，但对身体不是很好——少量地用还没什么问题罢了。`, `芸对术式的认识发生了不小的动摇。"好吧，所以这样——"伸出手，向上一扬，便散出点点光芒，然后便飞出手心，飘向地上越变越暗直至消失。"挺﹣漂亮的，但没有什么攻击性。"`, `诚严浅笑："有个好头了。你的这个起码很是……可爱，"，侧身大笑，"至少没像我当时烧了我的一些东西。"随后眼含笑意地看看共双手相握，向前一送——"啊？"店里浮出了温暖的光，拉伸成一条丝带，缓缓涌动在店中。"不是，你这家伙——"随后芸收回右手，又一推，光带便向外奔去，店内只。剩一脸惊讶的诚严。诚严脸上的笑容便显得有些凄惨。`, `"有种冲动，然后放出来了。可惜只是好看。"芸抿了一口茶，"你觉得呢？"`, `此时响彻全城的广播响起："各位市民大家下午好。今天，发生了一场反抗运动，敌国的眼线企图通过游行吸引注意，掩盖对抿霖中心区的进攻。这是一场令人愤怒的挑衅。本次事件中，有四人因冲突死亡，分别为被控制后抵抗不从的蓝宇，秦轼二眼线，护卫队第三执行使。与一位平民。另有数人受伤，造成中心区一定损失。请各市民引以为戒，并积极举报身边的可疑行为。我们永远铭记执行使与平民的付出，心中坚定击溃敌人的愤怒。"`, `"靠，"诚严一脚踩在地上，"这给我当外敌？脑子被火烧了？"一脸不满，但双手无力地颤抖着。芸侧了侧脑袋，"你认识？""弑梦潭的几个家伙。之前我们关系还不错。这样搞我们啊——唉。"诚严又仰头，长叹一口气。"我还能……我……真是。"`, `芸苦笑："我不知道怎么说吧。人有悲欢离合，总是要有的，来日报伤，不是一报仇。"`, `诚严转向芸。"你还是孩子。虽然你也有可能有些某时要报的仇，但我们遭受了更多的苦难。--不然你永远不会知道末式的存在，而我们毕竟是为了报仇。"`, `芸向茶杯中撒下一些光点。"我并不没有。如果你见过这店曾经的样子。"`, `诚严低头叹气："也是。"随后以一种冰冻得芸发麻的眼神盯着芸，"但命运不公。"`, `六点半的闹钟响起。诚严看了看表，起身放下茶杯。"待久了。这次份乱不足以消解……"顿了一下"下次见。"转身向外走去，在夕阳渐暗的路上远去。`, `失败了啊——"芸躺在床上，关着灯玩弄着手中的光带。"明天会有人照亮我吗？"睡梦中，芸脑中突然一道红光闪过，惊吓中国处观里，只是眼中剩下一道光柱，似乎吸引着她，向那里走去。芸尝试用来光点亮视线，在光带周围却有红色消融。芸忽然意识到，光柱的方向正指向中心区﹣而肯定是某种术式，让人不觉走向红光。但芸庆幸——"嘿！"光团从手心送出，膨胀为一个光球，笼罩住芸，随之消散的还有那诡开的红光。"有用呢，"芸下床快步向房间外走去，却见父母仿佛失了灵魂向门外走去。惊恐之际，用同样的方式笼罩了父母，二人很快回过神来："我怎么——父亲捂了下脑袋，"一股红光，"芸问，"是吧，老爸？"母亲点点头："不过，刚刚的白光是？"父亲摇头："问女儿。"芸摇头："问我干嘛，我也不知道。"`, `交淡之间，门外传来动静。越来越大，芸看向店外，透过小窗，是芸此生难忘之景：`, `一道冲破天际的光柱，像喷泉从地面喷出，将天空速成惊骇的血红色。血红的天下，许多人向江光之处浑噩地走去，如丧尸围城，显然颇为恐怖。`, `10 "天啊，这什么？"芸从晚惚中恢复，告诉父母："肯定是有术者来了。这么大的效果，看来中心区要完了。"父亲则冷静地坐到一边："嗯——不对啊。他如果可以控制这么大范围的人，为什么不直接上呢？"几人沉思了一会，芸反应过来："他们可以，但上面肯定不敢滥杀平民。他们需要掩护。"现在又是夜晚，他不能滥杀的。"`, `随着红光渐起，人群中出现了低吼声，渐而变得多了，声浪一波一波汹涌而来，只在这血红的天底下增添了几分诡开。芸心中不由得一紧——也许她不愿面对这该死的局面，与其清醒着记着，倒却不如那样地身陷混浊。`, `﹣三人有些恒怯，故而退上二楼，向下迎接着人群。红光下几人不敢睡去（而且也被吓得倦意全无。`, `芸突然想到了未式的其他人。她拿出通迅器，在父母疑惑而怀开的眼神中给瑕亘几人拨了通讯，但都毫无反应。"女儿啊，这是？"父亲问。"和朋友做的一些研究，可以在城里用上上面的，通讯网。"共只好撒了个谎，"但我们没多的了。"父亲摆手，"没事，到时候让咱们也用一用。"得到女儿的点头，父亲便不再言语。`, `此时已将近黎明。江光淡了许多，而街道上归于宁静，也没有了人。太阳逐渐升起，便将天空再染回了灰蓝。`, `有一只旗子倒在店门口。举旗的人已不知踪迹，只剩路边旗子，在风中抖动。`,],
    },
    {
      id: counter.next(),
      chapter: 0,
      index: "Main 0-6-1",
      name: "纷乱 #1",
      unlock: () => player.dev,
      description: `拾起的回忆碎片。`,
      content: [`时间:???`, `今天至少足够离奇，而只是一个夜晚，能让这时的我写下这一篇。`, `根据一些记忆，这是一种控制类的术式，而且视觉效果也足够神奇壮观。至少几乎全城的人都被调动了，可见威力之大。血色通天，地上人群嘶吼，却更像传说的丧尸围城吧。不过还有好事：原来我可能真不是残断者，只是能力比较弱罢了。这一天要感谢诚严，他为我打开了新世界。期待数年后的我会是什么样的，如果我靠这东西成了什么大人物，必是还要给诚严回报的。`, `我的施术类型大概也是控制类，大概更能反制那种术式。如果未来有别人看到了这件事，我是该为一些人负责任的。也许我需要一些时间释然。我该不该去救那些人呢？如果我救了，真不知道他们会怎样看我。这种能力的一种分界却总归使我有点……害怕吧。`, `但最有问题的倒还是诚严。（他的喝英品味也是难说。）虽然可能还是我太小了，瑕亘没有，但我还是不愿意怀疑瑕亘，但仍有一些问题，在于我能否相信瑕亘，至少现在我还无法判断两人中哪个更值得相信。）这种可能超越这个世界规则的存在，虽然我会了，但不知是否有什么未知的副作用。`, `现在还没有这次"革命"的更多消息。等会去中心区看看吧。`, `希望这温柔的光别被父母发现了呢。`,],
    },
    {
      id: counter.next(),
      chapter: 0,
      index: "Main 0-F",
      name: "静寂之城，无垠之夜",
      unlock: () => player.dev,
      description: `她从未想过，可眼前即是光明。`,
      content: [`芸决定去中心区看看。`, `无人的街道上，一片惨白的寂静。这时本该蜷缩在对门的小猫却不知去处，大门敞开着，楼梯上四处散落的灰尘只见识了凌乱的脚步。街边却几乎没什么变化，除了被蹂阀的小草与一生散落的枝叶标记着人来过的踪迹——仿若死城，芸不由得打了个寒战。一阵冷风吹来。，去中心区的路上也如此，没见到哪怕一个人的影子。芸加快了脚步，从一条条小巷中穿梭而过，向之前那栋楼赶去。路上，芸却更加感到难以呼吸，而脚步也越来越重。于是芸停下了脚步，向中就区深望了一眼。于是换了身边的一栋楼上去，远望其间之"景色"。`, `没有人。没有人。没有人——结果却显得这个世界没了别人。从这边看去，却像什么都没有发生，甚至连游行的痕迹都被抹去。但芸仍能看到一些诡异——那光景却不似这阴天当有的明媚，只像一幅画展开在她的面前。而且这画卷也充满瑕疵，在一些边角的地方突兀地断开，插入了一段别的颜色"只能这样吗？假的可笑——算了，回去吧。"芸听到了一句不属于她的声音。`, `向后转身，映入芸眼帘的是一个高硕的身影。那人比芸高一个头，双手祖在胸前，越过芒，目光望向远方。芸下意识向后退了一步，左手护在身前："你……?"`, `"不用知道。"他俯视芸，眼中有一丝玩味的笑意，"看这样子，你在昨夜幸存了呢，真是个幸运的孩子。"随后从兜中掏出一把刀，"我没有什么恶意。但你防备也没用，"芸一摸腰间﹣什么都没摸到。"还你咯。回去吧，你们这种人，还是不要关心为好。"便向后转身，眨眼间不见踪迹。芸一头雾水。她并不认识他，但无论如何她现在不用关心。芸向店里赶回。`, `父母仍在楼上休息。芸回到小房间，拿出通讯器给几乎所有认识的人打了通话。但，未接通，未接通未接通﹣直至列表最后的瑕亘。计时一秒秒过去，直至第29秒时——`, `。"你还醒着？"瑕亘的声音充满激动，"天啊，我以为你们都……"传来咽塞声。芸像与星生活时一样安慰瑕亘，不过显然瑕亘不那么容易失智。"你现在还能联系上谁吗？"声音很快便恢复了平静但瑕亘心情倒是一时半会难以平复。`, `"没有人。这是我打的最后一个通话了。他们都……"芸便不再言语，两人陷入了一段无言的沉默之中一会瑕亘开口："那这样，我先往你店里赶。你去过周围一些别的地块了吗？"芸便回答："去过中心区，有人在那里应该布置了屏障，看不到里面。那里有些术式的余威，我过不去。"`, `"好，我马上到。"瑕亘挂断了通讯。芸轻轻地上了楼，看见父母在交谈些什么，在他们察觉之前离开了。芸仍先泡了一壶菜，梳理了一下这些事。但日记不能给瑕亘，绝对不能，便将日记本收回小房间当中。`, `不久，瑕亘推门而入。"你们这全没了？"想必瑕迫己体会了这冷寂的风景。"我不清楚，大概。"芸拿起一杯茶，"先喝口余再走吧。"亘接过杯子抬头一饮而尽，"咱们走，"瑕亘放下杯子，眼睛又看了一圈，"小店不错。"`, `芸又走了一遍这段路。不久，熟悉的晕眩感再次袭来。瑕亘也觉着了不对劲，从腰间摸出一个小黑球交给芒，"拿着，握在手心。"芸接过小球，晕眩感便渐消退了。"这是一种小工具，等你再待久一点就会有你的了。"伸手拉住芸，越过屏障向前走去。`, `一步向前，虚假的画像如起风的静湖，漾起层层"涟涛"。芸只觉得自己被一团光芒围着，什么都看不见，只得随着瑕亘一步一步向前走去。这屏障并不很薄，数十步后才迈出白光，见到了内在的风景，却令芸大吃一惊——`, `有很多人倒在地上。其中有不少芸认识的人，也有护卫队的（可敬的是他们仍坚握着武器），倒头躺着。芸和瑕亘查看了最近的一人："还活着，但你看他的脸——"芒一下向一边弹开："哇啊﹣什么啊！"脸上被一层薄薄的江雾罩着。颇为吓人。`, `"你有没有感受，不，你术源排斥吗？"瑕亘在兜里摸索着，问。"不是。"然后拿出了一个片状物，"贴在手臂上，然后试着和我念，■■■■"芸将其贴在手上，但手却没有什么感觉，"■■■■"芸像上次一样放出白光球，递到那人脸上——红光很快消解了。"不错，竟然能反制控制类的。"瑕亘说。那人醒来了："我这是——你——小理发师？"恍忽地从地上坐起，那人看了看四周，问了两人。一些现状的问题。"谢谢，——再见。好运。"`, `so两人向中心区大楼靠近。路边的人都是这样，无一例外地带着红光倒在地上。当然二人并没有太多时间解决（救助）这些人，当务之急是查看中心区大楼的状况。芸忽地有点紧张。楼下护卫队的士兵也倒在地上。玻璃门的渣子安然地放在地上。跨过这些玻璃，瑕亘从一个算工作服的人身上搜出一张卡，打开了电梯。不过这张卡只能到12楼，意味看那最后三层仍要自己爬。两人做好准备，走出电梯门，——直到看间这里也充斥着江雾。`, `-"天啊。所有人都……"芸内心有些难受。她并不很期待活过这样的"末日"。`, `"嗯，——唉。"瑕亘想说什么，但终堵在了嗓子里，只化得一声叹息。`, `s 瑕亘找了几人，最后从一个办公室中摸出了直达15楼的电梯卡。"真是幸运。紧张吗？"芸一时失语。"呃——嗯﹣有点吧。"两人再次进入电梯。`, `门一打开，甚便被其中的"宏观"震往了。这一层有常规的两倍高，所以从外面看上去是16层。有一块屏幕，上面也许是监控画面——但只剩两三个仍在工作。在屏前，有一人缓缓转身。"又见面了呢，孩子。——瑕亘？"芸一下又受了听，连连后退："什么﹣不是﹣啊？"1。"你们见过？"瑕亘挑了挑眉。"不像什么愉快的相遇呢。你干什么了啊，孩子吓成这样。""所以你们来干什么？"对方逃避了这个问题，转而反问瑕亘。`, `风如何？你让她说吧。下面那些人？"瑕亘靠在墙上。"如你所想。"对方轻挑了下眉。"认识一下吧，我是拉鲁，瑕亘的……同事？"注意到瑕亘的杀意聚焦在他身上文改了口；"弟弟、亲姐弟。""我……叫我草云就好了。"芸终于走了过来。"你——唉。所以昨晚你干的？"`, `"嗯哼，为了响应好兄弟的进攻，借用了一下他们的力量。只是昨晚用力过头了，波及了周围……""波及？我甚至也差点来不了了，就躺那了，现在整个A13全被你端了，——你打算怎么弄？"芸有些生气。"A13本地人。所以你要解决一下这个问题了。"瑕亘走上前，拾起拉鲁的领子，"你小子最好。所以那人呢？""会的，马上。哦，这呢。"他帮着二人，指了指一个小房间。"他在里面，刚物理交流了一下。""那民霖是不是……"芸突然想到。`, `。"嗯。"瑕亘点了点头。"去玩吧。"`,],
    },
    {
      id: counter.next(),
      chapter: 0,
      index: "Main E-0",
      displayIndex: `Main <span style="color: #ff0000">E-0</span>`,
      name: "无垠，惨白荒原",
      unlock: () => player.dev,
      description: `她迷失在了无垠的黑暗中。`,
      content: [`芸与瑕亘姐弟下了楼。将屏障极除，洁净的天空又变成了浑浊的样子。此时已迫近黄昏，而天边却被厚厚的云层遮住了。共将倒地的人们施术唤醒，安抚了几下情绪又转头处理下一个人。`, `忙完了。几人坐在地上休息了一会，便各自告别。"再见咯，小云，那个条你应该吸收了，不用管了，记得哦！拜～"瑕亘回头与芸道别。然后拎着拉鲁的领子走了。`, `回到店里，芸吃了父母留下的便当。芸觉得还是饿，便从房间中找出一些零食享用。`, `"在吗，芸姐？"芸听到星的声音。出门一看，街道上却没有星的身影，只有一些路人与她打招呼。怪呢。芸知道星不会与她开这么低级的玩笑了。便回到店里坐下写日记。`, `但芸就是静不下来。也许是今天太过劳累或说是干了件大事，尝让芸停不下心来专心记录。做了一会思想斗争，芸还是放弃了写日记的计划。便泡了一些茶，趁没事散散心。"`, `路上并没有什么人。芸更觉得诡开——怎么会如此地喧嚣呢？已至夜晚，这反而是极不寻常的。摇。了摇自己的脑袋，芸更用不掉那浮沉的心里了。越要镇静，却越显得浮躁，只是芸还是回到店中喝茶。"今天状态不好啊。"她自言自语。`, `茶已泡好了，散发出浓郁的香气。﹣为什么这么香？芸看了看茶罐，发现有了些破损。"唉，烦啊。"芸边洗茶杯边抱怨。`, `午夜。去的梦中，她胸前挂着一盏小灯，身在无垠的黑暗之中。走着，便只看得见脚下白色的荒土，而视线越来越模糊，直至漫出了黑色的高点——芸痛苦地蹲下，直至在理智的眼中，小灯灭了。第二天人们发现芸变了。她却失了眼里的光，充斥着混乱的情绪。`, `芸已然疯了。无意识地从15楼跳下。`, ``, `情绪的代价。无意地刺入了太多的意识，却最被反噬。共回头一看，漆黑的惨白荒原满是人。——灵魂还是意识？`, `但她在乎这个也没用了`,],
    }
  ]

export class StoryMainClass extends StoryClass {
  chapter: number
  constructor(data:StoryMainData) {
    super(data);
    this.chapter = data.chapter
  }

  static createAccessor(data:StoryMainData[]):Accessor<StoryMainClass> {
    const all = data.map(x => new this(x))
    const accessor = (x:number) => noEmpty(all.find(a => a.id == x))
    accessor.all = all
    return accessor
  }
}

export const StoryMain =
  StoryMainClass.createAccessor(StoryMainData)
