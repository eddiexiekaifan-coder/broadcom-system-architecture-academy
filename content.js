/* Course content is versioned with the site. Personal learning data stays in the browser. */
window.ACADEMY = {
 version:1,
 sources:[
 ['Broadcom · BCM78900 / Tomahawk 5 产品资料','https://www.broadcom.com/products/ethernet-connectivity/switching/strataxgs/bcm78900-series'],
 ['Broadcom · Merchant Silicon 产品组合','https://www.broadcom.com/info/switching/merchant-silicon'],
 ['RFC 7938 · 数据中心 Clos 与 BGP 路由','https://www.rfc-editor.org/rfc/rfc7938'],
 ['Broadcom · OpenBCM 公开代码与平台资料','https://github.com/Broadcom-Network-Switching-Software/OpenBCM'],
 ['Open Compute Project · 公开项目与规范入口','https://www.opencompute.org/']
 ],
 lessons:[
 {id:'a',code:'MODULE A',short:'需求与 TCO',title:'从客户需求到系统成本',desc:'业务目标 · 性能指标 · 成本与取舍',minutes:12,legacy:true,tags:['TCO','需求','CAPEX','OPEX'],sections:[
 ['a1','先定义服务目标',`<p>交换机设计的起点是客户需要完成什么工作。先写清业务是 AI 训练、通用云计算、存储还是承载网络，再把诉求转成可验证的指标：端点数量、NIC 速率、流量矩阵、延迟、故障后的吞吐和扩容周期。</p><div class="callout">“需要 51.2T 交换机”是一个产品参数；“单台 Spine 故障后仍满足全部接入带宽”才是可以驱动架构选择的服务目标。</div><p>区分峰值标称带宽、有效业务吞吐和完成任务所需时间。包长、协议开销、拥塞和通信同步都会影响结果，不能只用端口速率代表训练性能。</p>`],
 ['a2','用 TCO 比较方案',`<p>TCO（总拥有成本）包含采购与持续运营。比较方案时采用相同规模、相同时间范围和相同冗余要求。</p><div class="formula">TCO = 设备与光连接采购 + 能源与制冷 + 运维 + 业务中断成本</div><ul><li>CAPEX：交换机、模块、线缆、机柜、备件及安装。</li><li>OPEX：供电、制冷、维护、升级与故障恢复。</li><li>隐含代价：训练变慢、业务等待、容量碎片和扩容停机。</li></ul><p>价格与功耗必须用项目 BOM 和实测数据补齐。课程中的交换机数量可以比较结构差异，不能替代正式报价。</p>`],
 ['a3','工程练习：冗余值多少钱？',`<p>比较 Lesson 2 的 8 Leaf + 4 Spine 与 16 Leaf + 5 Spine。后者增加 9 台交换机、64 条 800G Leaf–Spine 链路；若每条链路两端均使用可插拔光模块，则额外需要 128 个链路端模块，具体连接方案另行核算。</p><p>评审时同时提交：单台 Spine 故障后的接入/上联比、链路数量、整机和模块功耗、机柜占用、故障收敛时间及恢复流程。让客户在可见的成本和服务目标之间作选择。</p>`]
 ]},
 {id:'b',code:'MODULE B',short:'计算与通信',title:'AI 计算如何产生网络需求',desc:'GPU / NIC · Scale-up / Scale-out · 通信模式',minutes:14,legacy:true,tags:['GPU','Scale-up','Scale-out','NIC','NVIDIA'],sections:[
 ['b1','先看通信边界',`<p>Scale-up 通常描述较紧密的加速器互联域，Scale-out 通常描述跨服务器扩展；边界取决于具体系统。不能仅凭 Ethernet 或某个 ASIC 名称判断它属于哪一种。</p><p>本课程以 Broadcom 交换机架构为主线。NVIDIA 的 NVLink / NVSwitch 只作为计算互联背景，Spectrum Ethernet 或 InfiniBand 可用于横向比较；各方案的协议、生态和管理方式应分别评估。</p><div class="callout">GPU 数量 → 服务器数量 → NIC 端点与速率 → 流量模型 → 网络拓扑 → ASIC 与整机。</div>`],
 ['b2','流量模型比总速率更进一步',`<p>All-reduce、All-to-all 等集体通信会形成不同的带宽与拥塞需求。相同总接入带宽，可能因为同步突发、热点、Incast、跨机架比例而呈现完全不同的排队行为。</p><ul><li>确认每台服务器有多少个 Fabric NIC，而非把所有管理口都计入。</li><li>说明 NIC 如何映射到 GPU、Leaf 和网络平面。</li><li>明确故障域：链路、Spine、Leaf、机架还是整个平面。</li></ul><p>本课程 TH5 案例把一台服务器的 NIC 计入同一 Leaf 的预算。这方便教学，但没有提供 Leaf 故障保护；双归属或多平面设计必须重新计算。</p>`],
 ['b3','工程案例：规模不变，网络翻倍',`<p>1024 张 GPU、每服务器 8 张，始终是 128 台服务器。每服务器从 2×400G 改为 4×400G 后，总接入从 102.4T 增加到 204.8T。GPU 数量不变，网络预算已经变化。</p><p>下一步应先检查下联、上联、Breakout、Spine 端口和故障后的剩余带宽。更换为深缓存 ASIC 不能凭空增加物理链路容量。</p>`]
 ]},
 {id:'c',code:'MODULE C',short:'ASIC 与整机',title:'Broadcom ASIC 到整机实现',desc:'Tomahawk / Trident / Jericho / Qumran · 硬件映射',minutes:16,legacy:true,tags:['Tomahawk','Trident','Jericho','Qumran','SerDes','FEC','Buffer'],sections:[
 ['c1','选型是能力组合',`<p>Broadcom 的 Tomahawk、Trident、Jericho、Qumran 提供不同的带宽、转发、流量管理与系统组合。家族名只帮助定位，最终必须核对具体芯片与 SKU 的官方资料。</p><p>先列出需要的功能矩阵：端口速率、表项规模、隧道、ACL、QoS 层级、缓存需求、Telemetry、时延、SDK 和功耗。不要把所有代际归为同一种内部架构，也不要用未公开的缓存容量作判断。</p><div class="callout">端口资源不足是容量问题；突发排队是流量管理问题。增加 Buffer 可以容纳短时突发，但不能修复持续输入速率高于输出速率。</div>`],
 ['c2','把端口预算映射到硬件',`<p>TH5 官方标称支持最高 64×800GbE 或 128×400GbE，容量为 51.2Tb/s。物理连接器数量由整机决定；“ASIC 支持”不代表任意板卡都支持任意 Breakout 组合。</p><ul><li>建立逻辑端口、物理端口、SerDes Lane、前面板连接器的映射表。</li><li>核对端口宏、MAC/PCS、FEC、介质和 SDK 支持模式。</li><li>完成 ASIC–PCB–连接器–模块的链路预算与信号完整性验证。</li><li>是否需要 Retimer 取决于实际通道预算与目标误码率。</li></ul><p>100G 是本课程的标称 Lane 级别。SerDes 物理信号速率、编码与 FEC 开销应查对应接口规范，不能直接用载荷速率推断全部电气参数。</p>`],
 ['c3','系统并不只有 ASIC',`<p>CPU 负责控制面与管理软件；BMC 提供独立管理能力；CPLD 常承担板级时序、复位与状态控制。具体职责随整机设计变化。</p><p>设计评审应覆盖电源轨与上电时序、时钟、复位、I²C/MDIO/PCIe 可达性、模块管理、传感器、风扇、FRU、日志和固件升级恢复。用原理图和设计规范确认真实连接，不凭芯片名称猜测板级实现。</p>`]
 ]},
 {id:'d',code:'MODULE D',short:'拓扑与冗余',title:'Clos、容量与故障域',desc:'Leaf / Spine · ECMP · 路径与带宽冗余',minutes:15,legacy:true,tags:['Clos','ECMP','N-1','Oversubscription','冗余'],sections:[
 ['d1','两层 Clos 的约束',`<p>在本课程的两层 Leaf–Spine Fabric 中，每台 Leaf 连接每台 Spine。Leaf 提供服务器接入，Spine 提供 Leaf 之间的路径。每个连接组可以有多条等速物理链路。</p><div class="formula">Leaf 端口：下联当量 + Spine 数 × 每组链路 ≤ 64<br>Spine 端口：Leaf 数 × 每组链路 ≤ 64</div><p>这些式子使用 800G 物理端口当量，并假设下联 400G 可按 2:1 拆分。还需要核对所有端点是否接入、链路是否对称以及总容量是否匹配。</p>`],
 ['d2','把 N-1 写完整',`<p>N-1 应说明哪个部件失效，以及故障后要满足什么指标。能继续转发只说明路径仍在，不保证保留全部吞吐。</p><div class="formula">D ≤ (S − 1) × k × 0.8T</div><p>D 是每 Leaf 下联带宽，S 是 Spine 数，k 是每台 Leaf 到每台 Spine 的 800G 链路数。该式只检查单 Spine 故障后的汇总上联容量。</p><p>ECMP 分流、单流上限、目的端拥塞、故障检测与路由收敛仍需单独验证。总容量 1:1 不是任意流量下零排队的保证。</p>`],
 ['d3','从拓扑进入验证',`<p>用正常态、单链路故障、单 Spine 故障和恢复四类场景检查吞吐与丢包。记录流数量、包长、哈希设置、收敛时间以及计数器变化。</p><p>RFC 7938 是公开的 Clos/BGP 设计参考，涵盖带宽、ECMP 和收敛；项目仍需结合目标 NOS、SDK 及硬件能力。</p>`]
 ]},
 {id:'e',code:'MODULE E',short:'验证与交付',title:'机柜、Bring-up 与系统交付',desc:'OCP · 电源散热 · 打流 · Telemetry',minutes:17,legacy:true,tags:['OCP','48V','CFM','Bring-up','PRBS','PFC','ECN'],sections:[
 ['e1','基础设施约束',`<p>OCP 是规范与开放项目生态，不等于所有机柜和交换机都使用同一种接口。输入电源、电压范围、Busbar、机械尺寸和管理方式必须按客户指定的规范版本核对。</p><p>功耗预算包含 ASIC、CPU、BMC、光模块、风扇及转换损耗。风量 CFM 需要与静压、风道阻抗、进风温度及热源分布联合考虑，不能只看风扇的自由风量。</p><p>液冷方案还要评审冷板、流量、压差、接头、泄漏检测及维护流程。这里保留工程检查方法，不假定某一产品已经采用这些方案。</p>`],
 ['e2','分层 Bring-up',`<ol><li>基础电气：电源轨、时钟、复位、热状态与板级总线。</li><li>器件可达：CPU、ASIC、CPLD、BMC、模块与传感器。</li><li>链路建立：Lane Mapping、模块模式、FEC、Link Training 与 PRBS。</li><li>转发验证：端口配置、VLAN/路由、包长、流分布与性能。</li><li>系统验证：压力、长稳、热、故障注入、升级恢复和交付记录。</li></ol><p>PRBS 有助于定位物理链路问题，但不能单独证明完整转发路径正常。FEC 计数、MAC 丢弃、队列丢包与应用吞吐要关联分析。</p>`],
 ['e3','案例：蛇形流丢包怎样定位？',`<p>这是通用排查演练，不是某个实际项目的已确认结论。先固定端口速率、包长、路径和软件版本，记录逐端口 RX/TX、FEC、CRC、队列丢弃及流控计数。</p><ul><li>从最小链路开始，逐跳扩大蛇形路径，确定首个异常点。</li><li>检查注入速率口径、包间隙、循环放大与速率不对称。</li><li>物理层异常与队列拥塞分开验证，保留前后对照。</li><li>ECN/PFC 参数必须结合端点拥塞算法、缓存阈值和拓扑验证。</li></ul><div class="callout">ECN 是拥塞标记；PFC 是按优先级暂停。两者不是同一个机制，也不能仅凭“开启”推断网络已无损。</div>`]
 ]},
 {id:'l1',code:'MODULE 1 · LESSON 1',short:'TH5 · 1024 GPU 推导',title:'从 1024 GPU 推导 TH5 Clos 架构',desc:'从端点到网络，再到 51.2T 交换机整机',minutes:22,tags:['TH5','1024 GPU','51.2T','800G','Clos','Breakout'],sections:[
 ['l1-input','01 / 先写清教学假设',`<p>以 Broadcom BCM78900 Tomahawk 5 为核心，从客户网络需求反推交换机。以下是教学方案，未经某个真实客户部署背书。</p><div class="table-wrap"><table><tr><th>输入</th><th>设定</th></tr><tr><td>GPU / 服务器</td><td>1024 张 / 每台 8 张 → 128 台服务器</td></tr><tr><td>Fabric NIC</td><td>每服务器 2×400G，共 256 个 400G 接口</td></tr><tr><td>交换机</td><td>TH5，假设整机有 64 个 800G 物理口，支持所需 2×400G Breakout</td></tr><tr><td>网络目标</td><td>两层 Clos；正常态接入/上联带宽 1:1</td></tr></table></div><div class="formula">128 × 2 × 0.4T = 102.4T 接入带宽</div><p>本课程带宽采用端口标称单方向求和口径，不再将 TX/RX 相加。GPU 数量只用于求服务器数量，NIC 配置才直接决定接入预算。</p>`],
 ['l1-budget','02 / 一台 Leaf 怎样分配端口？',`<p>选择每台 Leaf 连接 16 台服务器，即 32 个 400G NIC，接入带宽 12.8T。将 16 个 800G 口拆分用于下联，再用 16 个 800G 口上联。</p><div class="table-wrap"><table><tr><th>资源</th><th>接口</th><th>800G 物理口当量</th><th>带宽</th></tr><tr><td>下联</td><td>32×400G</td><td>16</td><td>12.8T</td></tr><tr><td>上联</td><td>16×800G</td><td>16</td><td>12.8T</td></tr><tr><td>预留</td><td>未分配</td><td>32</td><td>25.6T 当量</td></tr></table></div><div class="formula">Leaf 数 = 256 个 NIC ÷ 32 个 NIC/Leaf = 8 台</div><p>这是选定接入密度后的结果，<strong>不是 1024 GPU 的唯一或最小交换机数量</strong>。如果把 Leaf 上下联端口都用满，理论上也可以设计 4 Leaf + 2 Spine 的正常态容量方案，但扩容余量和故障行为会不同。</p>`],
 ['l1-topology','03 / 加上 Spine，完成 Clos',`<p>本例选择 4 台 Spine，每台 Leaf 到每台 Spine 连接 4×800G。全部 Leaf 均与全部 Spine 相连。</p><div data-diagram="l1"></div><div class="formula">每 Leaf 上联 = 4 Spine × 4 链路 × 0.8T = 12.8T<br>每 Spine 占用 = 8 Leaf × 4 链路 = 32 个 800G 口<br>Leaf–Spine 物理链路 = 8 × 4 × 4 = 128 条</div><p>因此本例共 8 台 Leaf + 4 台 Spine = 12 台 TH5。每台 Spine 尚有 32 个 800G 口未分配。跨服务器通信可能经过 NIC → Leaf → Spine → Leaf → NIC；同 Leaf 通信不一定经过 Spine。</p><div class="callout warning">初始 8+4 方案也不具备满带宽 N-1：失去一台 Spine，每 Leaf 剩余 9.6T，上下联比变为 12.8/9.6 ≈ 1.33:1。预留端口只是未来改造资源，不会自动变成故障时可用带宽。</div>`],
 ['l1-hardware','04 / 网络如何约束整机？',`<p>从端口规划继续落实到具体 SKU、SDK 端口模式、SerDes 映射、前面板、光模块、PCB 与电源散热。芯片支持某个速率组合，只代表能力边界，必须验证目标整机能实现该组合。</p><p>光连接数量、距离、介质与模块功耗影响前面板和散热；管理可达性、固件恢复、Telemetry 影响大规模运维。Retimer 取舍需要实际信号链路预算，不能由 TH5 名称直接决定。</p>`],
 ['l1-quiz','05 / 设计决策练习',`<p>128 台服务器从每台 2×400G 升级为 4×400G，继续要求 1:1。最合理的第一步是什么？</p><div id="quiz" class="quiz-options"><button data-answer="A">A · 保持 8 台 Leaf，仅增加 NIC 接入</button><button data-answer="B">B · 重新计算 Leaf 数量与上联端口预算</button><button data-answer="C">C · 直接换为 Deep Buffer ASIC</button><button data-answer="D">D · 只增加 Spine，不调整 Leaf</button></div><div id="quiz-feedback" class="quiz-feedback" role="status"></div><p>选择只影响本节练习记录，不替换课程内容。原学习记录中你已选择 B；可再次点击查看各选项取舍。</p>`]
 ]},
 {id:'l2',code:'MODULE 1 · LESSON 2',short:'Leaf / Spine · N-1 冗余',title:'端口预算与 N-1 带宽冗余',desc:'同样 1024 GPU，如何应对带宽翻倍与单 Spine 故障',minutes:25,tags:['N-1','TH5','Leaf','Spine','冗余','端口预算'],sections:[
 ['l2-review','01 / B 正确：先算资源，再选扩容方法',`<p>128 台服务器改为每台 4×400G，总接入为 204.8T。B 是正确起点。A 可能在重新分配端口后成立，但不能只加 NIC；C 的深缓存不能增加链路容量；D 只有在 Leaf 上联资源和物理连接同步调整后才可能有效。</p><div class="formula">Pdown + Pup ≤ 64<br>D = NIC/Leaf × 0.4T；U = 上联数 × 0.8T<br>正常态 1:1 要求 U ≥ D</div><p>这里 P 按 800G 物理口当量计。所有例子都假设整机和 SDK 支持所需 Breakout、端口组合和链路聚合方式。</p>`],
 ['l2-a','02 / 方案 A：保留 8 Leaf + 4 Spine',`<p>每台 Leaf 接 16 台服务器，共 64×400G 下联 = 25.6T，占 32 个 800G 口当量；上联用 32×800G = 25.6T。每台 Leaf 到每台 Spine 为 8 条 800G。</p><div class="formula">Leaf 口数 = 32 下联当量 + 4 × 8 上联 = 64<br>Spine 口数 = 8 Leaf × 8 链路 = 64</div><p>每台交换机端口都用满。正常态带宽预算满足 1:1，共 256 条 Leaf–Spine 物理链路。</p><div class="callout warning">单台 Spine 故障：上联剩 24×800G = 19.2T。接入仍是 25.6T，比例为 1.33:1，容量损失 25%。路径还在，但满带宽保证消失。</div>`],
 ['l2-b','03 / 方案 B：16 Leaf + 5 Spine',`<p>将每台 Leaf 接入降为 8 台服务器，即 32×400G = 12.8T，占 16 个 800G 口当量。每 Leaf 分别向 5 台 Spine 连接 4×800G，上联总计 16T。</p><div class="formula">Leaf 口数 = 16 + 5 × 4 = 36 ≤ 64<br>Spine 口数 = 16 × 4 = 64<br>失去一台 Spine：4 × 4 × 0.8T = 12.8T = D</div><p>正常态上联比下联多 25%；单 Spine 故障后，汇总上联仍能覆盖全部下联带宽。方案共 21 台交换机、320 条 Leaf–Spine 链路。它是一个易于推导的可行示例，未做全局最少设备数优化。</p><div class="table-wrap"><table><tr><th>比较项</th><th>方案 A</th><th>方案 B</th></tr><tr><td>Leaf / Spine / 总计</td><td>8 / 4 / 12</td><td>16 / 5 / 21</td></tr><tr><td>每 Leaf 下联 / 上联</td><td>25.6T / 25.6T</td><td>12.8T / 16T</td></tr><tr><td>Spine 故障后上联</td><td>19.2T</td><td>12.8T</td></tr><tr><td>N-1 接入/上联比</td><td>1.33:1</td><td>1:1</td></tr><tr><td>链路数</td><td>256</td><td>320</td></tr><tr><td>每 Leaf 未分配 800G 口当量</td><td>0</td><td>28</td></tr></table></div>`],
 ['l2-lab','04 / 亲手切换一次故障',`<p>在架构实验室选择方案 A 或 B，再切换“单台 Spine 故障”，观察端口预算、容量和拓扑。还可调整服务器 NIC 数与 Leaf/Spine 数，查看组合是否可行。</p><a class="button primary" href="#lab">打开架构实验室 ↗</a><p>实验室只计算对称两层 Clos 的端口和汇总带宽，不模拟实际包转发。需要额外验证 ECMP 哈希、单流吞吐、目的端热点、故障收敛和恢复过程。</p>`],
 ['l2-boundary','05 / 把冗余要求写进评审',`<p>本节的 N-1 仅指<strong>单台 Spine 失效</strong>。它不覆盖 Leaf 故障、同机架断电、多故障叠加或整个网络平面丢失。服务器双归属、多 Rail/平面要另建端口与故障预算。</p><p>交付前至少明确：正常态容量、故障后容量、最大收敛时间、允许丢包与业务影响、故障检测机制，以及恢复验证方法。1:1 汇总预算不能等同于所有流量下无阻塞。</p><div class="callout">下次学习方向：64×800G、128×400G 与混合速率形态如何映射到 Lane、MAC/PCS、FEC、模块和前面板。当前课程保留不变，新内容会作为独立章节加入。</div>`]
 ]}
 ],
 glossary:[
 ['TH5','Tomahawk 5','Broadcom BCM78900 系列，课程采用 51.2T、64×800G 平台进行端口预算。具体组合以 SKU 与整机资料为准。','l1','ASIC'],
 ['Clos','多级互联拓扑','本课程采用两层 Leaf–Spine 结构，每 Leaf 到每 Spine 有连接。连接组可含多条物理链路。','d','架构'],
 ['Breakout','端口拆分','将一个高速物理口组织成多个低速逻辑口。芯片、板卡、介质与 SDK 需要同时支持。','c','硬件'],
 ['N-1','单故障服务目标','必须指定失效设备及故障后的性能目标。本节仅计算单台 Spine 故障后的汇总带宽。','l2','架构'],
 ['Oversubscription','超额订阅比','本课程定义为下联带宽/可用上联带宽。25.6T/19.2T 为约 1.33:1。','l2','架构'],
 ['ECMP','等价多路径','把流量分配到等价路由路径。汇总带宽足够，不代表哈希后每条路径都均匀。','d','架构'],
 ['SerDes','串并转换收发器','高速芯片互联的物理收发通道。Lane 映射与通道损耗需要结合端口模式验证。','c','硬件'],
 ['FEC','前向纠错','用冗余编码纠正一定范围的链路错误。需区分已纠正与不可纠正计数，并按接口规范解释。','e','验证'],
 ['Buffer','缓存','吸收短时突发与速率不匹配；持续拥塞最终仍需限速、扩容或端到端拥塞控制。','c','ASIC'],
 ['QoS','服务质量','分类、标记、排队、调度与限速的组合。功能与规模须按具体 ASIC/SDK 核对。','c','ASIC'],
 ['ECN','显式拥塞通知','通过标记反馈拥塞，需配合端点拥塞控制响应；不能单靠交换机配置保证应用效果。','e','验证'],
 ['PFC','优先级流量控制','按优先级暂停链路上的发送。阈值、Headroom、传播时延和暂停扩散都需要验证。','e','验证'],
 ['PRBS','伪随机比特序列','用于物理链路误码验证。PRBS 通过不等同于真实以太网转发测试通过。','e','验证'],
 ['CFM','每分钟立方英尺','风量单位；要结合系统静压、阻抗、温升和实际风道，不能用自由风量直接代表整机散热。','e','硬件'],
 ['TCO','总拥有成本','在统一周期内计入设备、连接、能源、制冷、运维与业务中断等成本。','a','架构'],
 ['Scale-up / Scale-out','扩展边界','描述计算与通信域的扩展方式，不能只由协议或芯片家族名称判断。','b','架构']
 ],
 cases:[
 {id:'case1',title:'1024 GPU · NIC 带宽翻倍',label:'容量规划',lesson:'l2',desc:'GPU 规模不变，128 台服务器从 2×400G 升到 4×400G。',result:'先重算 204.8T 接入，再检查 Leaf、Spine 和故障态容量。'},
 {id:'case2',title:'8+4 与 16+5 · 冗余的代价',label:'方案评审',lesson:'a',desc:'单台 Spine 故障后维持 1:1，需要多少额外资源？',result:'教学方案增加 9 台交换机、64 条 800G 链路，再对比光连接与运营成本。'},
 {id:'case3',title:'蛇形流丢包 · 分层定位',label:'Bring-up 演练',lesson:'e',desc:'吞吐下降时，先确认是物理误码、速率不对称还是拥塞。',result:'从最小链路逐跳扩大，用端口、FEC、CRC、队列和流控计数建立证据。'},
 {id:'case4',title:'64×800G · 从指标到硬件',label:'硬件评审',lesson:'c',desc:'同一 ASIC 的端口能力，如何落实到实际前面板？',result:'联合核对 SKU、端口宏、SDK、Lane Mapping、模块、通道预算与电源散热。'}
 ]
};
