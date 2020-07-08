import classnames from 'classnames'
import { useContext, useState, useEffect } from 'react'
import { cloneDeep } from 'lodash'
import { MatrixTableContext, MatrixTableContextProvider } from './context'
import fetch from 'node-fetch';
import { BASE_API_URL } from '../../constants/constants'

type Props = {
  initialMatrix?: import('../../types').Matrix
} & import('react').HTMLAttributes<HTMLDivElement>

/**
 * Add 4 buttons: 
 * - Cancel to reset the matrix to how it was before changing the values (only when in edit mode)
 * - Edit to make the fields editable (only when not in edit mode)
 * - Clear to completely clear the table
 * - Save to save the table
 * @param param0 
 */
const MatrixTable: import('react').FC<Omit<Props, 'initialMatrix'>> = ({ className, children, ...props }) => {
  // State ------------------------------------------------------------------- //
  const [{ matrix, originalMatrix }, dispatch] = useContext(MatrixTableContext)
  const [isEditing, setEditing] = useState(false)
  const [matrixDataArr, setMatrixDataArr] = useState([])

  // Handlers ---------------------------------------------------------------- // 
  const handleChange = async (e, item_name, item_value, item_key) => {
    const inputVal = parseFloat(e.target.value);

    switch (item_key) {
      case 0:
        item_value.lite = inputVal;
        item_value.standard = 2 * inputVal;
        item_value.unlimited = 3 * inputVal;
        break;
      case 1:
        item_value.standard = inputVal;
        break;
      case 2:
        item_value.unlimited = inputVal;
        break;
      default:
        break;
    }
    const newData = matrixDataArr.map(row => {
      if (row.name === item_name) {
        return {
          ...row,
          item_value
        };
      }
      return row;
    });
    setMatrixDataArr(newData)
  }

  const handleKeyDown = (e) => {
    // Prevent characters that are not numbers ("e", ".", "+" & "-") ✨
    let checkIfNum;
    if (e.key !== undefined) {
      // Check if it's a "e", ".", "+" or "-"
      checkIfNum = e.key === "e" || e.key === "+" || e.key === "-";
    }
    else if (e.keyCode !== undefined) {
      // Check if it's a "e" (69), "." (190), "+" (187) or "-" (189)
      checkIfNum = e.keyCode === 69 || e.keyCode === 187 || e.keyCode === 189;
    }

    return checkIfNum && e.preventDefault();
  }

  function fetch_data() {
    fetch(`${BASE_API_URL}pricing`)
      .then(response => response.json())
      .then(data => {
        dispatch({ type: 'SET_MATRIX', payload: data })
      })
  }

  // You can save (to api) the matrix here. Remember to update originalMatrix when done.
  const save = async () => {
    let savingData = {}
    matrixDataArr.map(item => {
      savingData[item["name"]] = item["value"]
    })

    const response = await fetch(BASE_API_URL + 'save-pricing', {
      headers: {
        'Accept': 'application/json'
      },
      method: 'POST',
      body: JSON.stringify(savingData)
    });
    const json = await response.json();
    alert(json.message)
    setEditing(false)
    fetch_data()
  }

  const edit = () => {
    setEditing(true)
  }

  const cancel = () => {
    setEditing(false)
    const cloned = cloneDeep(matrix);
    const localData = Object.keys(cloned).map(key => ({ name: key, value: cloned[key] }))
    setMatrixDataArr(localData)
  }
  const clear = () => {
    dispatch({ type: 'SET_ORIGINAL_MATRIX', payload: originalMatrix })
  }

  // Effects ----------------------------------------------------------------- //
  useEffect(() => {
    fetch_data()
  }, [])

  useEffect(() => {
    // Object.keys(matrix).forEach(key => tempArr.push({ name: key, value: matrix[key] }))
    // setMatrixDataArr(tempArr)
    const cloned = cloneDeep(matrix);
    const localData = Object.keys(cloned).map(key => ({ name: key, value: cloned[key] }))
    setMatrixDataArr(localData)
  }, [matrix])

  // Rendering --------------------------------------------------------------- //
  const matrixDataTable = matrixDataArr.map((item, index) => {
    return (
      <tr key={index}>
        <td>
          {item.name}
        </td>
        <td>
          {isEditing ? (
            <input type="number" value={item.value.lite} onChange={(e) => handleChange(e, item.name, item.value, 0)} onKeyDown={(e) => handleKeyDown(e)}></input>
          ) : (
              item.value.lite
            )}
        </td>
        <td>
          {isEditing ? (
            <input type="number" value={item.value.standard} onChange={(e) => handleChange(e, item.name, item.value, 1)} onKeyDown={(e) => handleKeyDown(e)}></input>
          ) : (
              item.value.standard
            )}
        </td>
        <td>
          {isEditing ? (
            <input type="number" value={item.value.unlimited} onChange={(e) => handleChange(e, item.name, item.value, 2)} onKeyDown={(e) => handleKeyDown(e)}></input>
          ) : (
              item.value.unlimited
            )}
        </td>
        <style jsx>{`
          td {
            width: 250px;
            border: 1px solid #ddd;
            padding: 8px;
          }
        `}</style>
      </tr>
    );
  });

  return (
    <div className={classnames(['container', className])} {...props}>
      <button onClick={save}>Save</button>
      {
        isEditing ? (<button onClick={cancel}>Cancel</button>) : (<button onClick={edit}>Edit</button>)
      }
      <button onClick={clear}>clear</button>
      <br />
      <br />
      <table className="table" id="customers">
        <thead>
          <tr>
            <th>Months</th>
            <th>Lite</th>
            <th>Standard</th>
            <th>Unlimited</th>
          </tr>
        </thead>
        <tbody>
          {matrixDataTable}
        </tbody>
      </table>

      <style jsx>{`
        .container {
          margin:0;
          width:100%
        }
        #customers {
          font-family: "Trebuchet MS", Arial, Helvetica, sans-serif;
          border-collapse: collapse;
          width: 100%;
        }
        #customers th {
          width: 250px;
          border: 1px solid #ddd;
          padding: 8px;
        }
        #customers tr:nth-child(even){background-color: #f2f2f2;}
        #customers tr:hover {background-color: #ddd;}
        #customers th {
          padding-top: 12px;
          padding-bottom: 12px;
          text-align: left;
          background-color: #4CAF50;
          color: white;
        }
        button {
          padding: 10px 20px;
          // border-radius: 20px;
          margin-right: 20px;
          outline: none;
          background-color: #51c0ec;
          color: white;
          border: none;
          cursor: pointer;
          border: 1px solid #51c0ec;
        }
        button:hover {
          background-color: white;
          border: 1px solid #51c0ec;
          color: #51c0ec;
        }
        input {
          padding: 10px;
        }
      `}</style>
    </div>
  )
}

const MatrixTableWithContext: import('react').FC<Props> = ({ initialMatrix, ...props }) => {
  // You can fetch the pricing here or in pages/index.ts
  // Remember that you should try to reflect the state of pricing in originalMatrix.
  // matrix will hold the latest value (edited or same as originalMatrix)

  return (
    <MatrixTableContextProvider initialMatrix={initialMatrix}>
      <MatrixTable {...props} />
    </MatrixTableContextProvider>
  )
}

export default MatrixTableWithContext
