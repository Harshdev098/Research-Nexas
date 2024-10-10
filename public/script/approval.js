const fetchuploadfiles = async () => {
  const token = localStorage.getItem("accessToken");
  const headers = new Headers();
  headers.append("Authorization", `Bearer ${token}`);
  const response = await fetch("http://localhost:3000/api/stk_papers", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const results = await response.json();
  const ul = document.getElementById("ul1");
  console.log(results, "results");
  if (Array.isArray(results)) {
    results.forEach((result) => {
      createListItem(result, ul);
    });
  } else {
    createListItem(results, ul);
  }
};

const createListItem = (result, ul) => {
  const li = document.createElement("li");
  const h4 = document.createElement("h4");
  const img = document.createElement("img");
  img.src = "images/upload-image.jpg";
  li.appendChild(img);
  h4.textContent = result.filename;
  li.appendChild(h4);
  const strong = document.createElement("strong");
  strong.textContent = result.name;
  li.appendChild(strong);

  const p = document.createElement("p");
  p.textContent = result.collegename;
  li.appendChild(p);
  const id = document.createElement("p");
  id.textContent = result.id;
  li.appendChild(id);
  const btn = document.createElement("button");
  btn.textContent = "View";
  btn.type = "button";
  btn.onclick = () => {
    if (result.status !== 0) {
      btn.disabled = true;
      alert("Paper already approved!");
    } else {
      btn.disabled = false;
      const container = document.getElementById("container");
      container.style.display = "block";
      display(result.id);
      const papers = document.querySelector(".papers");
      papers.style.opacity = "0.6";
    }
  };
  li.appendChild(btn);
  ul.appendChild(li);
};
fetchuploadfiles();

const close = document.getElementById("close");
const papers = document.querySelector(".papers");
const container = document.getElementById("container");
close.onclick = () => {
  container.style.display = "none";
  papers.style.opacity = "1";
};
const cancel = document.getElementById("cancel");
cancel.onclick = () => {
  container.style.display = "none";
  papers.style.opacity = "1";
  result3 = document.getElementById("result3");
  result3.style.display = "block";
  setTimeout(() => {
    result3.style.display = "none";
  }, 2000);
};

const display = async (id) => {
  const path = document.getElementById("path");
  const sno = document.getElementById("paperid");
  const name = document.getElementById("name");
  const email = document.getElementById("email");
  const col_name = document.getElementById("col_name");
  const token = localStorage.getItem("accessToken");
  const headers = new Headers();
  headers.append("Authorization", `Bearer ${token}`);
  const response = await fetch(`/api/papers_detail?id=${id}`, {
    headers: {
      "Content-type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  if (response.ok) {
    const details = await response.json();
    const a = document.createElement("a");
    a.href = details.filepath;
    a.target = "_blank";
    a.textContent = "View the file";
    path.appendChild(a);
    name.textContent = details.name;
    email.textContent = details.email;
    sno.textContent = details.sno;
    col_name.textContent = details.col_name;
    const btn = document.getElementById("approve");
    btn.onclick = () => {
      approval(details.sno);
    };
  }
};

const approval = async (id) => {
  const token = localStorage.getItem("accessToken");
  const headers = new Headers();
  headers.append("Authorization", `Bearer ${token}`);
  const response = await fetch(`http://localhost:3000/approval?id=${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (response.ok) {
    const papers = document.querySelector(".papers");
    const container = document.getElementById("container");
    container.style.display = "none";
    papers.style.opacity = "1";
    result1 = document.getElementById("result1");
    result1.style.display = "block";
    setTimeout(() => {
      result1.style.display = "none";
      window.location.reload();
    }, 2000);
  }
};
