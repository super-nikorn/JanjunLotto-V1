export function renderDataTable(dataArray, containerId) {
  const container = document.getElementById(containerId);
  container.innerHTML = "";

  dataArray.forEach((data, index) => {
    const tr = document.createElement("tr");
    tr.className = `${
      index % 2 === 0 ? "bg-white" : "bg-gray-50"
    } border-b border-gray-200 hover:bg-indigo-50 transition`;
    tr.innerHTML = `
      <td class="py-2 px-4">${data.name}</td>
      <td class="py-2 px-4">${data.number}</td>
      <td class="py-2 px-4">${data.type}</td>
      <td class="py-2 px-4 text-right text-indigo-700 font-semibold">${Number(
        data.amount
      ).toLocaleString("th-TH")}</td>
    `;
    container.appendChild(tr);
  });
}

export function renderTotalAmount(amount, elementId) {
  const element = document.getElementById(elementId);
  element.textContent = amount.toLocaleString("th-TH", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export function renderTopNumbersByType(topByType, containerId) {
  const container = document.getElementById(containerId);
  container.innerHTML = "";

  const gridContainer = document.createElement("div");
  gridContainer.className =
    "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-xl";

  for (const type in topByType) {
    const topNumbers = topByType[type];
    if (topNumbers.length === 0) continue;

    const section = createTopTypeSection(type, topNumbers);
    gridContainer.appendChild(section);
  }

  container.appendChild(gridContainer);
}

function createTopTypeSection(type, topNumbers) {
  const section = document.createElement("div");
  section.classList.add(
    "bg-white",
    "p-4",
    "rounded-xl",
    "shadow-md",
    "hover:shadow-lg",
    "transition-all",
    "duration-200"
  );

  const title = document.createElement("h3");
  title.className = "text-lg font-bold mb-3 flex items-center";

  const icon = document.createElement("span");
  icon.className = "mr-2";
  icon.innerHTML = getTypeIcon(type);
  title.appendChild(icon);
  title.appendChild(document.createTextNode(`Top ${type}`));

  const ul = document.createElement("ul");
  ul.className = "space-y-3";

  topNumbers.forEach(([num, amt], idx) => {
    const li = document.createElement("li");
    li.className =
      "flex justify-between items-center p-2 rounded-lg hover:bg-gray-50";
    li.innerHTML = `
      <div class="flex items-center">
        <span class="w-7 h-7 flex items-center justify-center rounded-full 
          ${
            idx === 0
              ? "bg-yellow-400"
              : idx === 1
              ? "bg-gray-300"
              : "bg-pink-300"
          } 
          text-white font-bold mr-3">
          ${idx + 1}
        </span>
        <span class="font-bold text-gray-800">${num}</span>
      </div>
      <span class="font-bold ${idx === 0 ? "text-green-600" : "text-blue-600"}">
        ${amt.toLocaleString("th-TH")}฿
      </span>
    `;
    ul.appendChild(li);
  });

  section.appendChild(title);
  section.appendChild(ul);
  return section;
}

function getTypeIcon(type) {
  return type.includes("บน")
    ? "🔝"
    : type.includes("ล่าง")
    ? "🔻"
    : type.includes("โต๊ด")
    ? "🎯"
    : type.includes("ตรง")
    ? "✨"
    : type.includes("หน้า")
    ? "👆"
    : type.includes("ท้าย")
    ? "👇"
    : "🏅";
}
