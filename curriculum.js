/* Foundation v2 adds new material while retaining every original review section. */
(() => {
const A=window.ACADEMY;
A.foundationVersion='20261103-v2';
A.nextUnits=[
 {code:'H1',title:'端口形态与 SerDes 映射',focus:'64×800G、128×400G 与混合速率如何映射到实际板卡。',topics:['端口宏、MAC/PCS 与 Lane 的关系','前面板连接器、Breakout 与 SDK 端口模式','从 Lesson 2 的拓扑生成端口资源表'],output:'一份逻辑口—物理口—Lane—连接器映射表',gate:'完成 TH5 端口预算，并说明目标 SKU 和整机假设。'},
 {code:'H2',title:'高速链路与信号完整性',focus:'从接口速率走向可以建立、可以验证的物理链路。',topics:['通道损耗、连接器、过孔与 PCB 材料','Retimer 的取舍与链路预算','PRBS、FEC 与真实流量的验证边界'],output:'链路预算与 SI 验证矩阵',gate:'先完成端口映射，取得目标接口的正式电气与介质规范。'},
 {code:'H3',title:'供电、时钟、复位与管理',focus:'把 ASIC、CPU、BMC、CPLD 和模块组织成可启动、可恢复的整机。',topics:['电源轨、时序、输入保护与监控','时钟树、复位域及启动依赖','管理总线、固件升级与恢复路径'],output:'整机框图、时序表与故障恢复评审表',gate:'能够画出基础框架 D 的四类系统关系。'},
 {code:'H4',title:'光连接、功耗与散热',focus:'把端口密度落实为可供电、可散热、可维护的产品。',topics:['模块与线缆距离、兼容性和功耗预算','风道、静压、进风温度与热裕量','客户指定 OCP 机柜、电源与维护边界'],output:'端到端连接清单与功耗、散热预算',gate:'使用实际器件功耗与客户机柜规范，假设和实测分开记录。'},
 {code:'H5',title:'Bring-up 与故障定位',focus:'用分层证据定位上电、链路、转发和压力场景中的问题。',topics:['从电气可达、器件初始化到端口 Link Up','蛇形流、包长、流分布与拥塞计数','故障注入、复现和修复前后对照'],output:'Bring-up 检查表与故障定位树',gate:'已定义每层通过标准和需要采集的计数器。'},
 {code:'H6',title:'系统评审与项目交付',focus:'把架构推导、硬件实现和验证证据汇总成可评审方案。',topics:['需求、接口、容量与故障域的闭环','BOM、TCO、风险与验证覆盖率','可靠性、可维护性及交付文档'],output:'完整的 TH5 系统架构评审包',gate:'能够追溯每项设计选择对应的需求与验证结果。'}
];
const revisions={
 a:{short:'需求与系统约束',title:'需求与系统约束',desc:'需求口径 · 容量与故障目标 · 设计输入',minutes:18,tags:['需求矩阵','系统约束'],sections:[
 ['f-a-goal','基础 A1 / 把产品参数还原为设计目标',`<p>这一模块的目标是写出“为什么这样设计”，并形成各专业能够共同使用的设计输入。以你熟悉的 Broadcom 交换机为对象，先说明客户业务、设备在网络中的角色、接口对象和部署环境。</p><p>“51.2T、64×800G”描述资源上限与一种端口组织方式。系统设计还要明确端点配置、流量模式、故障后服务目标、扩容周期、机柜条件和运维方式，才能据此选择具体平台。</p><div class="callout">本阶段不从头复习所有硬件常识，而是把已有硬件经验组织为系统层面的约束与取舍。</div>`],
 ['f-a-input','基础 A2 / 建立一页设计输入',`<div class="table-wrap"><table><tr><th>设计输入</th><th>需要写清的口径</th></tr><tr><td>容量</td><td>服务器、Fabric NIC、速率、端口当量及带宽计量方向</td></tr><tr><td>性能</td><td>业务吞吐、包长与流分布、时延及突发条件</td></tr><tr><td>冗余</td><td>失效对象、故障后容量、收敛时间与允许业务影响</td></tr><tr><td>物理环境</td><td>机柜、电源、进风条件、介质距离和维护方式</td></tr><tr><td>边界</td><td>预算、交付周期、扩容余量、已知与待核实项</td></tr></table></div><p>每个数字都注明来自客户、公开规格、教学假设还是实测。缺少的输入写为待确认，避免用看似精确的数字掩盖未知条件。</p>`],
 ['f-a-check','基础 A3 / 本章输出与自检',`<p><strong>输出物：</strong>一页需求与约束表，并为每项要求指定验收方法。把某一项要求修改后，应能指出拓扑、ASIC、接口、供电或验证中哪些部分需要重新评估。</p><p><strong>自检问题：</strong>客户把每服务器 NIC 从 2×400G 改成 4×400G，为什么不能只看 GPU 数量？如果要求单 Spine 故障后仍保持全部接入容量，会增加哪些设计约束？这两个问题在第二阶段继续定量推导。</p>`]
 ]},
 b:{short:'计算与网络模型',title:'计算、通信与网络模型',desc:'通信边界 · 带宽与流量 · 网络平面和故障域',minutes:18,tags:['流量模型','网络平面'],sections:[
 ['f-b-boundary','基础 B1 / 先画通信经过的边界',`<p>先区分服务器内部、服务器之间、管理网络与业务 Fabric，再讨论 Scale-up 或 Scale-out。术语描述系统的扩展与通信边界，具体边界需要结合目标平台说明。</p><p>用 GPU → NIC → Leaf → Spine → Leaf → NIC 的路径理解跨服务器通信，并检查同 Leaf 流量是否需要经过 Spine。NVIDIA 的计算互联只作为背景对照，本课程的交换机预算与整机实现以 Broadcom 为主线。</p>`],
 ['f-b-model','基础 B2 / 三张表连接计算与交换机',`<ul><li><strong>端点表：</strong>服务器数、每服务器 Fabric NIC 数、速率，以及 NIC 到 Leaf/平面的映射。</li><li><strong>流量表：</strong>通信对象、同时活跃的流、热点、突发、包长和跨机架比例。</li><li><strong>故障表：</strong>链路、Spine、Leaf、机架或平面失效后，哪些端点与服务受影响。</li></ul><p>总带宽预算回答“汇总资源是否够用”；流量分布和收敛验证回答“这些资源能否在指定业务条件下被有效使用”。ECMP、排队、端到端拥塞控制与故障恢复需要在相应层面分别验证。</p><div class="formula">服务器数 × 每服务器 Fabric NIC 数 × NIC 速率 → 接入带宽预算</div>`],
 ['f-b-check','基础 B3 / 本章输出与自检',`<p><strong>输出物：</strong>一张通信边界图、一份端点清单，以及一张失效场景表。先保持单位与速率口径一致，再进入 Clos 的数值推导。</p><p><strong>自检问题：</strong>为什么总接入带宽相同的两个集群，实际拥塞行为可能不同？为什么单 Spine 冗余不能直接说明服务器具备 Leaf 故障保护？</p>`]
 ]},
 c:{short:'数据路径与 ASIC 选型',title:'交换机数据路径与 Broadcom ASIC 选型',desc:'报文处理 · 缓存调度 · 功能与资源匹配',minutes:22,tags:['数据路径','Ingress','Egress','ASIC选型'],sections:[
 ['f-c-path','基础 C1 / 建立逻辑数据路径',`<p>用逻辑视角理解：端口接收 → 报文解析与分类 → 查表与转发决策 → 缓存和调度 → 出端口发送。管理与控制软件负责配置、状态采集及相关控制逻辑。</p><div class="signal-chain"><span>接收 / 解析</span><i>→</i><span>分类 / 查表</span><i>→</i><span>缓存 / 调度</span><i>→</i><span>发送</span></div><p>这是学习模型，不是某一 Broadcom 芯片的内部微架构图。流水线组织、缓存机制和功能资源必须核对具体 ASIC、SKU 与软件版本，不能由家族名推断全部实现。</p>`],
 ['f-c-choice','基础 C2 / 用约束选择 ASIC',`<p>Tomahawk、Trident、Jericho、Qumran 用于不同的产品与系统组合。选型应建立能力矩阵，而不是只比较交换带宽或用“深缓存”概括所有行为。</p><div class="table-wrap"><table><tr><th>维度</th><th>需要核对的内容</th></tr><tr><td>接口与容量</td><td>Radix、速率组合、端口模式与整机可实现性</td></tr><tr><td>转发功能</td><td>路由、隧道、ACL、表项规模及所需协议能力</td></tr><tr><td>流量管理</td><td>缓存、队列、调度、QoS 与拥塞处理能力</td></tr><tr><td>平台约束</td><td>SDK/NOS 支持、功耗、散热、管理和供货条件</td></tr></table></div><p>公开资料能确认的能力、需要正式文档确认的细节和项目推断应分别记录。OpenBCM 可用于理解公开 API 与驱动结构；该公开仓库已归档，不能用来代替项目当前 SDK 的支持清单。</p>`],
 ['f-c-check','基础 C3 / 本章输出与自检',`<p><strong>输出物：</strong>一张逻辑数据路径图，以及针对客户需求的 ASIC 能力矩阵。每项关键结论附上具体资料或待验证项。</p><p><strong>自检问题：</strong>物理上联容量不足与突发排队分别应在什么层面处理？为什么 ASIC 标称支持的速率组合还需要整机、介质和 SDK 联合核查？</p>`]
 ]},
 d:{short:'整机框图与接口',title:'整机硬件框图与接口基础',desc:'数据 / 控制 / 管理关系 · 时钟复位 · 电源依赖',minutes:22,tags:['硬件框图','PCIe','I2C','MDIO','时钟','复位'],sections:[
 ['f-d-blocks','基础 D1 / 用四类关系看整机',`<p>学习硬件系统时，先画清四类关系：业务数据经过哪里、软件怎样配置器件、设备怎样被管理，以及供电/时钟/复位如何支持启动与运行。</p><div class="signal-chain"><span>模块 / 连接器</span><i>↔</i><span>交换 ASIC</span><i>↔</i><span>CPU / 控制软件</span></div><div class="signal-chain"><span>BMC / 管理</span><i>↔</i><span>CPLD / 板级控制</span><i>↔</i><span>电源 / 时钟 / 复位</span></div><p>图中表示需要核实的系统关系，不规定某一板卡的实际连接方式。具体接口、职责分工和依赖关系必须以项目原理图与设计规范为准。</p>`],
 ['f-d-interfaces','基础 D2 / 接口清单与启动依赖',`<p>针对目标整机，列出 ASIC、CPU、BMC、CPLD、模块、传感器和存储器之间的连接。按项目实际情况核查 PCIe、I²C、MDIO、UART、SPI、GPIO 等接口的用途、归属、访问路径和软件依赖。</p><ul><li>电源：输入边界、器件电源轨、时序、监控与故障响应。</li><li>时钟与复位：来源、分配、有效条件、复位域和先后依赖。</li><li>管理：正常运行、主 CPU 异常和升级失败时的可达性。</li><li>高速数据：逻辑端口、Lane、连接器和介质的对应关系。</li></ul><p>本章只建立系统框图与接口语言。具体 Lane 约束、通道预算、器件时序数值和电源设计计算进入第三阶段，并依据正式规格与实测数据展开。</p>`],
 ['f-d-check','基础 D3 / 本章输出与自检',`<p><strong>输出物：</strong>目标 Broadcom 交换机的一张整机框图、一张接口与责任归属表、一张启动依赖图。未知连接与参数保持待确认。</p><p><strong>自检问题：</strong>ASIC 无法初始化时，如何区分软件访问、供电、时钟与复位问题？主 CPU 失效后，哪些管理与恢复能力仍应可用？</p>`]
 ]},
 e:{short:'验证与故障分析',title:'系统验证与故障分析方法',desc:'分层证据 · 验收标准 · 复现与闭环',minutes:20,tags:['验证矩阵','故障分析','测量'],sections:[
 ['f-e-layers','基础 E1 / 每一层都有通过标准',`<p>按基础电气 → 器件可达与初始化 → 链路 → 报文转发 → 系统压力与故障恢复组织验证。每一层明确输入条件、测量对象、通过标准和失败后的下一步。</p><p>Link Up、PRBS 通过、FEC 计数正常、转发吞吐达标回答不同问题。某一层通过，不能替代其他层的验证。</p>`],
 ['f-e-evidence','基础 E2 / 从现象形成可复现证据',`<ul><li>固定硬件版本、软件/SDK、端口模式、模块和环境条件。</li><li>记录速率、包长、流数量、拓扑、注入方法与统计口径。</li><li>把电源/时钟/复位状态、链路误码、MAC 与队列计数和应用表现关联起来。</li><li>从最小可复现配置逐步扩大；每次只改变可解释的一组条件。</li><li>修复后执行前后对照，并验证正常态、故障态和恢复态。</li></ul><p>对未确认的根因使用“假设”和“待验证”，把事实、推断、改动与结果分开记录。详细 Bring-up、SI 与蛇形流实战在第三阶段展开。</p>`],
 ['f-e-check','基础 E3 / 本章输出与自检',`<p><strong>输出物：</strong>需求—测试—证据对应矩阵，以及一份可复现问题记录。每项设计要求应有可追溯的验证结果。</p><p><strong>自检问题：</strong>蛇形流掉包时，什么证据支持物理层问题，什么证据支持拥塞？为什么“测试跑过”还不足以说明已经覆盖故障恢复和长期稳定性？</p>`]
 ]}
};
for(const l of A.lessons){const r=revisions[l.id];if(!r)continue;l.archiveTitle=l.title;l.archiveSections=l.sections.map(s=>[...s]);l.foundationCount=r.sections.length;l.revised=true;l.short=r.short;l.title=r.title;l.desc=r.desc;l.minutes=r.minutes;l.tags=[...new Set([...l.tags,...r.tags])];l.sections=[...r.sections,...l.archiveSections.map(s=>[s[0],'历史复习 · '+s[1],s[2]])];}
A.sources[3][0]='Broadcom · OpenBCM 公开代码（历史归档）';
})();
