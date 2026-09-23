const stats = [
  { label: "Revenue", value: "R 0.00", change: "This month" },
  { label: "Expenses", value: "R 0.00", change: "This month" },
  { label: "Profit", value: "R 0.00", change: "Revenue − expenses" },
  { label: "Customers", value: "0", change: "Active customers" }
];

const quickActions = ["Add customer", "Record sale", "Add expense", "Create invoice"];

export default function Home() {
  return (
    <main className="shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="logo">R</div>
          <div>
            <strong>Business OS</strong>
            <span>by Rapsometeddy</span>
          </div>
        </div>

        <nav>
          {["Dashboard", "Customers", "Products", "Sales", "Expenses", "Invoices", "Reports"].map((item, i) => (
            <button className={i === 0 ? "nav active" : "nav"} key={item}>
              <span>{["⌂","♙","▦","↗","↘","▤","▥"][i]}</span>{item}
            </button>
          ))}
        </nav>

        <div className="sidebarBottom">
          <div className="miniCard">
            <span className="eyebrow">MVP</span>
            <strong>Business control center</strong>
            <small>Track the numbers that matter.</small>
          </div>
        </div>
      </aside>

      <section className="content">
        <header className="topbar">
          <div>
            <span className="eyebrow">OVERVIEW</span>
            <h1>Good morning 👋</h1>
            <p>Your business at a glance.</p>
          </div>
          <button className="primary">+ New transaction</button>
        </header>

        <section className="stats">
          {stats.map((stat) => (
            <article className="stat" key={stat.label}>
              <span>{stat.label}</span>
              <strong>{stat.value}</strong>
              <small>{stat.change}</small>
            </article>
          ))}
        </section>

        <section className="grid">
          <article className="panel chart">
            <div className="panelHead">
              <div>
                <span className="eyebrow">PERFORMANCE</span>
                <h2>Revenue overview</h2>
              </div>
              <span className="pill">Last 6 months</span>
            </div>
            <div className="emptyChart">
              <div className="bars">
                {[28, 45, 34, 62, 48, 78].map((height, i) => (
                  <div className="barWrap" key={i}>
                    <div className="bar" style={{ height: height + "%" }} />
                    <small>{["Apr","May","Jun","Jul","Aug","Sep"][i]}</small>
                  </div>
                ))}
              </div>
              <p>Add your first sale to start seeing business trends.</p>
            </div>
          </article>

          <article className="panel">
            <div className="panelHead">
              <div>
                <span className="eyebrow">QUICK START</span>
                <h2>Take action</h2>
              </div>
            </div>
            <div className="actions">
              {quickActions.map((action) => (
                <button className="action" key={action}>
                  <span>＋</span>{action}<b>›</b>
                </button>
              ))}
            </div>
          </article>
        </section>

        <section className="grid lower">
          <article className="panel">
            <div className="panelHead">
              <div><span className="eyebrow">RECENT</span><h2>Recent sales</h2></div>
              <button className="link">View all</button>
            </div>
            <div className="empty">
              <div className="emptyIcon">↗</div>
              <strong>No sales yet</strong>
              <p>Your latest sales will appear here.</p>
            </div>
          </article>

          <article className="panel">
            <div className="panelHead">
              <div><span className="eyebrow">CASH FLOW</span><h2>Recent expenses</h2></div>
              <button className="link">View all</button>
            </div>
            <div className="empty">
              <div className="emptyIcon">↘</div>
              <strong>No expenses yet</strong>
              <p>Keep track of every business cost.</p>
            </div>
          </article>
        </section>

        <footer>Rapsometeddy Business OS · MVP v0.1</footer>
      </section>
    </main>
  );
}
