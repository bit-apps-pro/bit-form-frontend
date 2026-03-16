export default function TemplateBoard() {
  return (
    <div className="template-board">
      <div className="template-board__content">
        <div className="board-left-panel">
          <div className="search-wrapper">
            <input type="text" placeholder="Search" />
          </div>
          <div className="template-categroy-list">

          </div>
        </div>
        <div className="template-board__content">
          <div className="template-board__content__item">
            <div className="template-board__content__item__header">
              <h2>Contact Form</h2>
            </div>
            <div className="template-board__content__item__body">
              <div className="template-board__content__item__body__field">
                <label>Name</label>
                <input type="text" placeholder="John Doe" />
              </div>
              <div className="template-board__content__item__body__field">
                <label>Message</label>
                <textarea />
              </div>
              <div className="template-board__content__item__body__field">
                <button type="submit">Submit</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
