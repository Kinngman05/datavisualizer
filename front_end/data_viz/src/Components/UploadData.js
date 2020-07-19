import React, { Component } from "react";
import { Upload, Button, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";
// import reqwest from 'reqwest';

class UploadData extends React.Component {
  state = {
    fileList: [],
    uploading: false,
  };

  handleUpload = () => {
    const { fileList } = this.state;
    // console.log("-->", formData);
    console.log("-->", fileList);
    this.setState({
      uploading: true,
    });
    for (var file in fileList) {
      console.log(file);
      const formData = new FormData();
      formData.append("file", fileList[file]);
      formData.append("filename", fileList[file].name);

      // You can use any AJAX library you like
      fetch("http://192.168.31.50:5000/upload", {
        method: "POST",
        body: formData,
      }).then((response) => {
        console.log("response", response);
        response.json().then((body) => {
          console.log("body", body);
          this.setState({ uploading: false });
          if(body.status)
            message.success(body.message+":File Uploaded!");
          else
            message.error(body.error)
        });
      });
    }
  };

  render() {
    const { uploading, fileList } = this.state;
    const props = {
      onRemove: (file) => {
        this.setState((state) => {
          const index = state.fileList.indexOf(file);
          const newFileList = state.fileList.slice();
          newFileList.splice(index, 1);
          return {
            fileList: newFileList,
          };
        });
      },
      beforeUpload: (file) => {
        this.setState((state) => ({
          fileList: [...state.fileList, file],
        }));
        return false;
      },
      fileList,
    };

    return (
      <>
        <Upload {...props}>
          <Button>
            <UploadOutlined /> Select File
          </Button>
        </Upload>
        <Button
          type="primary"
          onClick={this.handleUpload}
          disabled={fileList.length === 0}
          loading={uploading}
          style={{ marginTop: 16 }}
        >
          {uploading ? "Uploading" : "Start Upload"}
        </Button>
      </>
    );
  }
}

// class UploadData extends React.Component {
//   constructor(props) {
//     super(props);

//     this.state = {
//       imageURL: '',
//     };

//     this.handleUploadImage = this.handleUploadImage.bind(this);
//   }

//   handleUploadImage(ev) {
//     ev.preventDefault();

//     const data = new FormData();
//     data.append('file', this.uploadInput.files[0]);
//     data.append('filename', this.fileName.value);

//     fetch('http://localhost:5000/upload', {
//       method: 'POST',
//       body: data,
//     }).then((response) => {
//       response.json().then((body) => {
//         this.setState({ imageURL: `http://localhost:5000/${body.file}` });
//       });
//     });
//   }

//   render() {
//     return (
//       <form onSubmit={this.handleUploadImage}>
//         <div>
//           <input ref={(ref) => { this.uploadInput = ref; }} type="file" />
//         </div>
//         <div>
//           <input ref={(ref) => { this.fileName = ref; }} type="text" placeholder="Enter the desired name of file" />
//         </div>
//         <br />
//         <div>
//           <button>Upload</button>
//         </div>
//         <img src={this.state.imageURL} alt="img" />
//       </form>
//     );
//   }
// }

export default UploadData;
