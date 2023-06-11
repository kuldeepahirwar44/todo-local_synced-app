import { useEffect, useState } from "react";

const getLocalListData = () => {
  const list = localStorage.getItem("list") ?? "[]";
  return JSON.parse(list);
};

const TodoList = () => {
  const [activity, setActivity] = useState("");
  const [listData, setListData] = useState([]);
  const [agreement, setAgreement] = useState(false);

  const handleChange = () => setAgreement((prev) => !prev);

  const updateList = (dataToSave) => {
    setListData(dataToSave);
    localStorage.setItem("list", JSON.stringify(dataToSave));
  };

  const addActivity = () => {
    updateList([
      ...listData,
      {
        id: Math.floor(Math.random() * 999999),
        data: activity,
        isChecked: false,
      },
    ]);
    setActivity("");
  };

  const removeActivity = (id) =>
    updateList(listData.filter((elem) => elem.id !== id));

  const updateCheckActivity = (id) =>
    updateList(
      listData.filter((elem) => {
        if (elem.id === id) elem.isChecked = !elem.isChecked;
        return elem;
      })
    );

  const removeAll = () => {
    updateList([]);
    setAgreement((prev) => !prev);
  };

  useEffect(() => {
    const syncData = getLocalListData();
    setListData(syncData);
  }, []);

  return (
    <div className="container">
      <header>
        <h1>📝 Todo List</h1>
      </header>

      <hr />

      <main>
        <div className="add-controls-container">
          <input
            type="text"
            placeholder="Add Activity"
            value={activity}
            onChange={(e) => setActivity(e.target.value)}
            onKeyDown={(e) => {
              e.key === "Enter" &&
                !e.shiftKey &&
                e.target.value.length > 2 &&
                addActivity();
            }}
          />

          <button
            className={`addBtn ${
              activity.length > 2 ? "button-with-hover" : ""
            }`}
            disabled={!(activity.length > 2)}
            onClick={addActivity}
          >
            ➕&nbsp;Add
          </button>
        </div>

        <br />

        {Array.isArray(listData) && listData.length > 0 ? (
          <form>
            <fieldset>
              <legend className="List-heading">
                Here is your CheckList: ✔
              </legend>

              <section className="listContainer">
                {Array.isArray(listData) && listData.length > 0
                  ? listData.map((data) => (
                      <div key={data.id} className="list-item">
                        <div className="listData">
                          {data.isChecked ? (
                            <s>
                              <span>{data.data}</span>
                            </s>
                          ) : (
                            data.data
                          )}
                        </div>
                        <div className="individual-checked-remove-container">
                          <label>
                            <input
                              type="checkbox"
                              defaultValue={data.isChecked}
                              onChange={() => updateCheckActivity(data.id)}
                            />
                            Checked
                          </label>
                          <button
                            className="removeBtn button-with-hover"
                            onClick={() => removeActivity(data.id)}
                          >
                            ❌&nbsp;Remove
                          </button>
                        </div>
                      </div>
                    ))
                  : null}
              </section>

              {Array.isArray(listData) && listData.length > 1 ? (
                <>
                  <hr />
                  <section className="removeAll-controls-container">
                    <label className="check-removeAll">
                      <input
                        className="check"
                        type="checkbox"
                        onChange={handleChange}
                        checked={agreement}
                      />
                      I am ready to remove all items.
                    </label>

                    <button
                      className={`removeAllBtn ${
                        agreement ? "button-with-hover" : ""
                      }`}
                      disabled={!agreement}
                      onClick={removeAll}
                    >
                      🗑️&nbsp;Remove&nbsp;All
                    </button>
                  </section>
                </>
              ) : null}
            </fieldset>
          </form>
        ) : null}
      </main>
    </div>
  );
};

export default TodoList;
