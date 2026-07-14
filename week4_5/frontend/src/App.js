import React, { useEffect, useMemo, useState } from "react";
import ReactECharts from "echarts-for-react";

import {
  Alert,
  Button,
  ConfigProvider,
  Empty,
  Form,
  Input,
  Splitter,
  Tabs,
  Tag,
  Tooltip,
  message,
} from "antd";

import {
  BarChartOutlined,
  ClearOutlined,
  DatabaseOutlined,
  LineChartOutlined,
  PieChartOutlined,
  SendOutlined,
} from "@ant-design/icons";

import "antd/dist/reset.css";
import "./App.css";

/*
  固定不变的图表公共配置放在 App() 外面。
  这样 useMemo 不需要把它加入依赖数组，
  也不会再出现 ESLint warning。
*/
const commonChartStyle = {
  animationDuration: 900,
  animationEasing: "cubicOut",

  textStyle: {
    color: "#53627a",
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Microsoft YaHei", sans-serif',
  },
};

function App() {
  // GET 输入框
  const [input1, setInput1] = useState("");

  // POST 输入框
  const [input2, setInput2] = useState("");
  const [input3, setInput3] = useState("");

  // 后端返回结果
  const [result, setResult] = useState("");
  const [requestType, setRequestType] = useState("");
  const [requestError, setRequestError] = useState(false);

  // 请求按钮加载状态
  const [getLoading, setGetLoading] = useState(false);
  const [postLoading, setPostLoading] = useState(false);

  // sales 数据，用于柱状图和折线图
  const [salesData, setSalesData] = useState({
    months: [],
    amounts: [],
  });

  // categories 数据，用于饼图
  const [categoryData, setCategoryData] = useState([]);

  // 当前显示的图表
  const [currentChart, setCurrentChart] = useState("bar");

  // Flask 后端地址
  const backendUrl = "http://127.0.0.1:5000";

  // 页面第一次打开时加载图表数据
  useEffect(() => {
    const loadChartData = async () => {
      try {
        const [salesResponse, categoryResponse] = await Promise.all([
          fetch(`${backendUrl}/api/sales`),
          fetch(`${backendUrl}/api/categories`),
        ]);

        if (!salesResponse.ok) {
          throw new Error(
            `销售数据请求失败，状态码：${salesResponse.status}`
          );
        }

        if (!categoryResponse.ok) {
          throw new Error(
            `分类数据请求失败，状态码：${categoryResponse.status}`
          );
        }

        const salesResult = await salesResponse.json();
        const categoryResult = await categoryResponse.json();

        setSalesData(salesResult);
        setCategoryData(categoryResult);
      } catch (error) {
        console.error("加载图表数据失败：", error);
        message.error("图表数据加载失败，请检查 Flask 后端");
      }
    };

    loadChartData();
  }, []);

  // GET 请求
  const getData = async () => {
    if (!input1.trim()) {
      message.warning("请先输入 GET 请求参数");
      return;
    }

    setGetLoading(true);
    setRequestError(false);

    try {
      const response = await fetch(
        `${backendUrl}/api/get?param=${encodeURIComponent(input1)}`
      );

      if (!response.ok) {
        throw new Error(`请求失败，状态码：${response.status}`);
      }

      const data = await response.json();

      setResult(data.message);
      setRequestType("GET");
      message.success("GET 请求成功");
    } catch (error) {
      setResult(`GET 请求失败：${error.message}`);
      setRequestType("GET");
      setRequestError(true);
      message.error("GET 请求失败，请检查 Flask 后端");
    } finally {
      setGetLoading(false);
    }
  };

  // POST 请求
  const postData = async () => {
    if (!input2.trim() || !input3.trim()) {
      message.warning("请填写完整的 POST 请求参数");
      return;
    }

    setPostLoading(true);
    setRequestError(false);

    try {
      const response = await fetch(
        `${backendUrl}/api/post?param=${encodeURIComponent(input3)}`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          // 与后端 app.py 中读取的 bodyValue 保持一致
          body: JSON.stringify({
            bodyValue: input2,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`请求失败，状态码：${response.status}`);
      }

      const data = await response.json();

      setResult(data.message);
      setRequestType("POST");
      message.success("POST 请求成功");
    } catch (error) {
      setResult(`POST 请求失败：${error.message}`);
      setRequestType("POST");
      setRequestError(true);
      message.error("POST 请求失败，请检查 Flask 后端");
    } finally {
      setPostLoading(false);
    }
  };

  // 清空输入框和返回结果
  const clearData = () => {
    setInput1("");
    setInput2("");
    setInput3("");
    setResult("");
    setRequestType("");
    setRequestError(false);

    message.info("内容已清空");
  };

  // 柱状图配置
  const barOption = useMemo(
    () => ({
      ...commonChartStyle,

      title: {
        text: "每月销售额柱状图",
        left: "center",
        top: 4,

        textStyle: {
          color: "#263550",
          fontSize: 18,
          fontWeight: 600,
        },
      },

      tooltip: {
        trigger: "axis",
        backgroundColor: "rgba(255, 255, 255, 0.96)",
        borderColor: "#d5dfec",
        borderWidth: 1,

        textStyle: {
          color: "#34445e",
        },

        axisPointer: {
          type: "shadow",

          shadowStyle: {
            color: "rgba(111, 145, 190, 0.08)",
          },
        },
      },

      grid: {
        left: "7%",
        right: "5%",
        top: 75,
        bottom: 58,
        containLabel: true,
      },

      xAxis: {
        type: "category",
        data: salesData.months,

        axisTick: {
          show: false,
        },

        axisLine: {
          lineStyle: {
            color: "#b9c5d5",
          },
        },

        axisLabel: {
          color: "#687791",
          margin: 14,
        },
      },

      yAxis: {
        type: "value",
        name: "销售额（元）",

        nameTextStyle: {
          color: "#71809a",
          padding: [0, 0, 12, 0],
        },

        axisLine: {
          show: false,
        },

        axisTick: {
          show: false,
        },

        axisLabel: {
          color: "#71809a",
        },

        splitLine: {
          lineStyle: {
            color: "#e8edf4",
            type: "dashed",
          },
        },
      },

      series: [
        {
          name: "销售额",
          type: "bar",
          data: salesData.amounts,
          barWidth: "36%",

          label: {
            show: true,
            position: "top",
            color: "#41516b",
            fontSize: 12,
          },

          itemStyle: {
            borderRadius: [7, 7, 2, 2],

            color: {
              type: "linear",
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,

              colorStops: [
                {
                  offset: 0,
                  color: "#6597df",
                },
                {
                  offset: 1,
                  color: "#91afd4",
                },
              ],
            },

            shadowColor: "rgba(69, 104, 153, 0.16)",
            shadowBlur: 10,
            shadowOffsetY: 5,
          },
        },
      ],
    }),
    [salesData]
  );

  // 折线图配置
  const lineOption = useMemo(
    () => ({
      ...commonChartStyle,

      title: {
        text: "每月销售额折线图",
        left: "center",
        top: 4,

        textStyle: {
          color: "#263550",
          fontSize: 18,
          fontWeight: 600,
        },
      },

      tooltip: {
        trigger: "axis",
        backgroundColor: "rgba(255, 255, 255, 0.96)",
        borderColor: "#d5dfec",

        textStyle: {
          color: "#34445e",
        },
      },

      grid: {
        left: "7%",
        right: "5%",
        top: 75,
        bottom: 58,
        containLabel: true,
      },

      xAxis: {
        type: "category",
        boundaryGap: false,
        data: salesData.months,

        axisTick: {
          show: false,
        },

        axisLine: {
          lineStyle: {
            color: "#b9c5d5",
          },
        },

        axisLabel: {
          color: "#687791",
          margin: 14,
        },
      },

      yAxis: {
        type: "value",
        name: "销售额（元）",

        nameTextStyle: {
          color: "#71809a",
        },

        axisLine: {
          show: false,
        },

        axisTick: {
          show: false,
        },

        axisLabel: {
          color: "#71809a",
        },

        splitLine: {
          lineStyle: {
            color: "#e8edf4",
            type: "dashed",
          },
        },
      },

      series: [
        {
          name: "销售额",
          type: "line",
          smooth: true,
          data: salesData.amounts,
          symbol: "circle",
          symbolSize: 9,

          label: {
            show: true,
            position: "top",
            color: "#41516b",
          },

          lineStyle: {
            width: 3,
            color: "#6d8fbd",
          },

          itemStyle: {
            color: "#ffffff",
            borderColor: "#6d8fbd",
            borderWidth: 3,
          },

          areaStyle: {
            color: {
              type: "linear",
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,

              colorStops: [
                {
                  offset: 0,
                  color: "rgba(109, 143, 189, 0.30)",
                },
                {
                  offset: 1,
                  color: "rgba(109, 143, 189, 0.02)",
                },
              ],
            },
          },
        },
      ],
    }),
    [salesData]
  );

  // 饼图配置
  const pieOption = useMemo(
    () => ({
      ...commonChartStyle,

      color: [
        "#5f8fcf",
        "#88a5c8",
        "#aebdce",
        "#6f7f96",
      ],

      title: {
        text: "商品分类占比饼图",
        left: "center",
        top: 4,

        textStyle: {
          color: "#263550",
          fontSize: 18,
          fontWeight: 600,
        },
      },

      tooltip: {
        trigger: "item",
        formatter: "{b}<br/>数量：{c}<br/>占比：{d}%",

        backgroundColor: "rgba(255, 255, 255, 0.96)",
        borderColor: "#d5dfec",

        textStyle: {
          color: "#34445e",
        },
      },

      legend: {
        bottom: 12,

        textStyle: {
          color: "#65748c",
        },
      },

      series: [
        {
          name: "分类占比",
          type: "pie",
          radius: ["35%", "61%"],
          center: ["50%", "48%"],
          data: categoryData,

          itemStyle: {
            borderColor: "#ffffff",
            borderWidth: 4,
            borderRadius: 7,
          },

          label: {
            color: "#52617a",
            formatter: "{b}\n{d}%",
          },

          emphasis: {
            scaleSize: 8,

            itemStyle: {
              shadowBlur: 18,
              shadowColor: "rgba(54, 78, 111, 0.18)",
            },
          },
        },
      ],
    }),
    [categoryData]
  );

  // Tabs 图表项目
  const chartTabs = [
    {
      key: "bar",

      label: (
        <span className="tab-label">
          <BarChartOutlined />
          柱状图
        </span>
      ),

      children: (
        <ReactECharts
          option={barOption}
          notMerge
          lazyUpdate
          style={{
            width: "100%",
            height: "470px",
          }}
        />
      ),
    },

    {
      key: "line",

      label: (
        <span className="tab-label">
          <LineChartOutlined />
          折线图
        </span>
      ),

      children: (
        <ReactECharts
          option={lineOption}
          notMerge
          lazyUpdate
          style={{
            width: "100%",
            height: "470px",
          }}
        />
      ),
    },

    {
      key: "pie",

      label: (
        <span className="tab-label">
          <PieChartOutlined />
          饼图
        </span>
      ),

      children: (
        <ReactECharts
          option={pieOption}
          notMerge
          lazyUpdate
          style={{
            width: "100%",
            height: "470px",
          }}
        />
      ),
    },
  ];

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: "#6688b3",
          colorInfo: "#6688b3",
          colorSuccess: "#5aaa82",
          colorText: "#263550",
          colorTextSecondary: "#70809a",
          colorBorder: "#d8e1ec",
          colorBgLayout: "#f4f6f9",
          borderRadius: 12,
          controlHeightLG: 44,

          fontFamily:
            '-apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Microsoft YaHei", sans-serif',
        },

        components: {
          Tabs: {
            inkBarColor: "#6688b3",
            itemSelectedColor: "#526f96",
            itemHoverColor: "#6688b3",
          },

          Input: {
            activeBorderColor: "#7798c0",
            hoverBorderColor: "#93abc8",
          },
        },
      }}
    >
      <main className="page">
        {/* 接口请求区域 */}
        <section className="section-card request-section">
          <div className="section-header">
            <h1>接口请求测试</h1>

            <Tooltip title="清空所有输入和返回结果">
              <Button
                className="clear-button"
                icon={<ClearOutlined />}
                onClick={clearData}
              >
                清空
              </Button>
            </Tooltip>
          </div>

          <Splitter className="request-splitter">
            {/* GET 面板 */}
            <Splitter.Panel
              defaultSize="30%"
              min="23%"
              max="45%"
            >
              <div className="request-panel get-panel">
                <div className="panel-heading">
                  <Tag className="method-tag get-tag">
                    GET
                  </Tag>

                  <h2>GET 请求</h2>
                </div>

                <Form layout="vertical">
                  <Form.Item label="请求参数（param）">
                    <Input
                      size="large"
                      allowClear
                      placeholder="请输入第一个输入框参数"
                      value={input1}
                      onChange={(event) =>
                        setInput1(event.target.value)
                      }
                      onPressEnter={getData}
                    />
                  </Form.Item>

                  <Button
                    className="send-button get-button"
                    size="large"
                    icon={<SendOutlined />}
                    loading={getLoading}
                    onClick={getData}
                    block
                  >
                    发送 GET 请求
                  </Button>
                </Form>
              </div>
            </Splitter.Panel>

            {/* POST 面板 */}
            <Splitter.Panel
              defaultSize="34%"
              min="27%"
              max="48%"
            >
              <div className="request-panel post-panel">
                <div className="panel-heading">
                  <Tag className="method-tag post-tag">
                    POST
                  </Tag>

                  <h2>POST 请求</h2>
                </div>

                <Form layout="vertical">
                  <Form.Item label="请求体 bodyValue">
                    <Input
                      size="large"
                      allowClear
                      placeholder="请输入第二个输入框参数"
                      value={input2}
                      onChange={(event) =>
                        setInput2(event.target.value)
                      }
                    />
                  </Form.Item>

                  <Form.Item label="请求参数（param）">
                    <Input
                      size="large"
                      allowClear
                      placeholder="请输入第三个输入框参数"
                      value={input3}
                      onChange={(event) =>
                        setInput3(event.target.value)
                      }
                      onPressEnter={postData}
                    />
                  </Form.Item>

                  <Button
                    className="send-button post-button"
                    size="large"
                    icon={<SendOutlined />}
                    loading={postLoading}
                    onClick={postData}
                    block
                  >
                    发送 POST 请求
                  </Button>
                </Form>
              </div>
            </Splitter.Panel>

            {/* 返回结果面板 */}
            <Splitter.Panel
              defaultSize="36%"
              min="27%"
            >
              <div className="result-panel">
                <div className="panel-heading result-heading">
                  <h2>后端返回结果</h2>
                </div>

                {result ? (
                  <Alert
                    className="result-alert"
                    type={requestError ? "error" : "success"}
                    showIcon
                    message={
                      requestError ? "请求失败" : "请求成功"
                    }
                    description={
                      <div className="result-body">
                        <Tag
                          className={
                            requestType === "GET"
                              ? "result-get-tag"
                              : "result-post-tag"
                          }
                        >
                          {requestType}
                        </Tag>

                        <p>{result}</p>
                      </div>
                    }
                  />
                ) : (
                  <div className="result-empty">
                    <Empty
                      image={Empty.PRESENTED_IMAGE_SIMPLE}
                      description="返回结果将在这里显示"
                    />
                  </div>
                )}
              </div>
            </Splitter.Panel>
          </Splitter>
        </section>

        {/* 数据可视化区域 */}
        <section className="section-card chart-section">
          <div className="section-header">
            <h1>数据库可视化展示</h1>

            <Tag
              className="database-tag"
              icon={<DatabaseOutlined />}
            >
              MySQL 数据
            </Tag>
          </div>

          <div className="flow-border">
            <div className="chart-container">
              <Tabs
                activeKey={currentChart}
                onChange={setCurrentChart}
                items={chartTabs}
              />
            </div>
          </div>
        </section>
      </main>
    </ConfigProvider>
  );
}

export default App;
