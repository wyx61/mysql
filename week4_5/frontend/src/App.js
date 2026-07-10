import React, { useEffect, useState } from "react";
import ReactECharts from "echarts-for-react";
import { Menu } from "antd";
import "antd/dist/reset.css";
import "./App.css";

function App() {
  // Week4：三个输入框
  const [input1, setInput1] = useState("");
  const [input2, setInput2] = useState("");
  const [input3, setInput3] = useState("");

  // Week4：后端返回结果
  const [result, setResult] = useState("");

  // Week5：sales 表数据，用于柱状图和折线图
  const [salesData, setSalesData] = useState({
    months: [],
    amounts: []
  });

  // Week5：categories 表数据，用于饼图
  const [categoryData, setCategoryData] = useState([]);

  // 当前选中的图表，默认显示柱状图
  const [currentChart, setCurrentChart] = useState("bar");

  // Flask 后端地址
  const backendUrl = "http://127.0.0.1:5000";

  // 页面第一次打开时，自动请求数据库数据
  useEffect(() => {
    getSalesData();
    getCategoryData();
  }, []);

  // Week4：GET 请求
  const getData = async () => {
    const response = await fetch(
      `${backendUrl}/api/get?param=${input1}`
    );

    const data = await response.json();
    setResult(data.message);
  };

  // Week4：POST 请求
  const postData = async () => {
    const response = await fetch(
      `${backendUrl}/api/post?param=${input3}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          bodyValue: input2
        })
      }
    );

    const data = await response.json();
    setResult(data.message);
  };

  // Week5：请求 sales 数据
  const getSalesData = async () => {
    const response = await fetch(`${backendUrl}/api/sales`);
    const data = await response.json();

    setSalesData(data);
  };

  // Week5：请求 categories 数据
  const getCategoryData = async () => {
    const response = await fetch(`${backendUrl}/api/categories`);
    const data = await response.json();

    setCategoryData(data);
  };

  // 柱状图配置
  const barOption = {
    title: {
      text: "每月销售额柱状图"
    },
    tooltip: {},
    xAxis: {
      type: "category",
      data: salesData.months
    },
    yAxis: {
      type: "value"
    },
    series: [
      {
        name: "销售额",
        type: "bar",
        data: salesData.amounts
      }
    ]
  };

  // 折线图配置
  const lineOption = {
    title: {
      text: "每月销售额折线图"
    },
    tooltip: {},
    xAxis: {
      type: "category",
      data: salesData.months
    },
    yAxis: {
      type: "value"
    },
    series: [
      {
        name: "销售额",
        type: "line",
        data: salesData.amounts
      }
    ]
  };

  // 饼图配置
  const pieOption = {
    title: {
      text: "商品分类占比饼图",
      left: "center"
    },
    tooltip: {
      trigger: "item"
    },
    series: [
      {
        name: "分类占比",
        type: "pie",
        radius: "50%",
        data: categoryData
      }
    ]
  };

  // 根据当前菜单选择显示不同图表
  const showChart = () => {
    if (currentChart === "bar") {
      return <ReactECharts option={barOption} style={{ height: "400px" }} />;
    }

    if (currentChart === "line") {
      return <ReactECharts option={lineOption} style={{ height: "400px" }} />;
    }

    if (currentChart === "pie") {
      return <ReactECharts option={pieOption} style={{ height: "400px" }} />;
    }

    return null;
  };

  return (
    <div className="page">
      <h1>Week4 + Week5 前后端联调项目</h1>

      <div className="box">
        <h2>Week4：GET 请求</h2>

        <input
          placeholder="第一个输入框"
          value={input1}
          onChange={(e) => setInput1(e.target.value)}
        />

        <button onClick={getData}>发送 GET 请求</button>

        <h2>Week4：POST 请求</h2>

        <input
          placeholder="第二个输入框：body"
          value={input2}
          onChange={(e) => setInput2(e.target.value)}
        />

        <input
          placeholder="第三个输入框：param"
          value={input3}
          onChange={(e) => setInput3(e.target.value)}
        />

        <button onClick={postData}>发送 POST 请求</button>

        <h2>后端返回结果：</h2>
        <p>{result}</p>
      </div>

      <div className="box">
        <h2>Week5：数据库可视化展示</h2>

        <Menu
          mode="horizontal"
          selectedKeys={[currentChart]}
          onClick={(e) => setCurrentChart(e.key)}
          items={[
            {
              key: "bar",
              label: "柱状图"
            },
            {
              key: "line",
              label: "折线图"
            },
            {
              key: "pie",
              label: "饼图"
            }
          ]}
        />

        <div className="chart">
          {showChart()}
        </div>
      </div>
    </div>
  );
}

export default App;
