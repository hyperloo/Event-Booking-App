import React from "react";
import { Bar } from "react-chartjs-2";

const Chart = ({ bookings }) => {
  var Buckets = [
    {
      type: "Less Than 50",
      value: 0,
      color: { r: 255, g: 99, b: 132 },
      opacity: { nor: 0.2, hover: 0.4 },
    },
    {
      type: "Between 50 & 100",
      value: 0,
      color: { r: 156, g: 214, b: 26 },
      opacity: { nor: 0.2, hover: 0.4 },
    },
    {
      type: "Between 100 & 200",
      value: 0,
      color: { r: 10, g: 184, b: 13 },
      opacity: { nor: 0.2, hover: 0.4 },
    },
    {
      type: "More Than 200",
      value: 0,
      color: { r: 105, g: 217, b: 165 },
      opacity: { nor: 0.2, hover: 0.4 },
    },
  ];

  bookings.map((booking) => {
    // console.log(booking);
    if (booking.event.price < 50) {
      Buckets[0].value++;
    } else if (booking.event.price < 100) {
      Buckets[1].value++;
    } else if (booking.event.price < 200) {
      Buckets[2].value++;
    } else {
      Buckets[3].value++;
    }
  });

  let charData = { labels: [], datasets: [] };
  charData.labels = ["Cheap", "Normal", "Expensive", "Luxury"];
  Buckets.map((bucket) =>
    charData.datasets.push({
      label: [bucket.type],
      backgroundColor: `rgba(${bucket.color.r},${bucket.color.g},${bucket.color.b},${bucket.opacity.nor})`,
      borderColor: `rgba(${bucket.color.r},${bucket.color.g},${bucket.color.b},${bucket.opacity},1)`,
      borderWidth: 1,
      hoverBackgroundColor: `rgba(${bucket.color.r},${bucket.color.g},${bucket.color.b},${bucket.opacity.hover})`,
      hoverBorderColor: `rgba(${bucket.color.r},${bucket.color.g},${bucket.color.b},${bucket.opacity},1)`,
      data: [bucket.value],
    })
  );
  charData.datasets[0].data = [...charData.datasets[0].data, 0, 0, 0];
  charData.datasets[1].data = [0, ...charData.datasets[1].data, 0, 0];
  charData.datasets[2].data = [0, 0, ...charData.datasets[2].data, 0];
  charData.datasets[3].data = [0, 0, 0, ...charData.datasets[3].data];
  // console.log(Buckets);
  return (
    <div style={{ width: "40rem", maxWidth: "90%", margin: "2rem auto" }}>
      <Bar data={charData} />
    </div>
  );
};

export default Chart;
