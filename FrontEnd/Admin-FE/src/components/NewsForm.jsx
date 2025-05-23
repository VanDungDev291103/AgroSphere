import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import {
  Box,
  Button,
  TextField,
  Grid,
  Typography,
  CircularProgress,
  Switch,
  FormControlLabel,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { createNews, updateNews } from "../services/newsService";

const NewsForm = ({ news, onClose }) => {
  const [formData, setFormData] = useState({
    title: "",
    summary: "",
    content: "",
    imageUrl: "",
    sourceUrl: "",
    sourceName: "",
    category: "Nông nghiệp",
    tags: "",
    active: true,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Categories for selection
  const categories = [
    "Nông nghiệp",
    "Thủy sản",
    "Chăn nuôi",
    "Thị trường",
    "Khuyến nông",
    "Nông sản",
    "Thời tiết",
    "Khác",
  ];

  // Rich text editor modules/formats
  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      ["bold", "italic", "underline", "strike"],
      [{ list: "ordered" }, { list: "bullet" }],
      [{ indent: "-1" }, { indent: "+1" }],
      [{ align: [] }],
      ["link", "image"],
      ["clean"],
    ],
  };

  // Initialize form with existing news data if editing
  useEffect(() => {
    if (news) {
      setFormData({
        title: news.title || "",
        summary: news.summary || "",
        content: news.content || "",
        imageUrl: news.imageUrl || "",
        sourceUrl: news.sourceUrl || "",
        sourceName: news.sourceName || "",
        category: news.category || "Nông nghiệp",
        tags: news.tags || "",
        active: news.active !== undefined ? news.active : true,
      });
    }
  }, [news]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "active" ? checked : value,
    }));
  };

  // Handle rich text editor changes
  const handleContentChange = (content) => {
    setFormData((prev) => ({
      ...prev,
      content,
    }));
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Tạo một bản sao của formData để tránh sửa đổi state trực tiếp
      const dataToSubmit = { ...formData };

      // Khi tạo mới tin tức, không gửi trường active vì backend không có trong DTO
      if (!news) {
        delete dataToSubmit.active;
      }

      if (news) {
        // Update existing news
        await updateNews(news.id, dataToSubmit);
      } else {
        // Create new news
        await createNews(dataToSubmit);
      }
      onClose(true); // Close and refresh
    } catch (err) {
      console.error("Error saving news:", err);
      setError("Không thể lưu tin tức. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} noValidate>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            name="title"
            label="Tiêu đề"
            fullWidth
            required
            value={formData.title}
            onChange={handleChange}
            margin="normal"
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            name="summary"
            label="Tóm tắt"
            fullWidth
            required
            multiline
            rows={2}
            value={formData.summary}
            onChange={handleChange}
            margin="normal"
          />
        </Grid>

        <Grid item xs={12}>
          <Typography variant="subtitle1" gutterBottom>
            Nội dung
          </Typography>
          <ReactQuill
            value={formData.content}
            onChange={handleContentChange}
            modules={modules}
            style={{ height: "300px", marginBottom: "50px" }}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            name="imageUrl"
            label="URL Hình ảnh"
            fullWidth
            value={formData.imageUrl}
            onChange={handleChange}
            margin="normal"
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <FormControl fullWidth margin="normal">
            <InputLabel>Danh mục</InputLabel>
            <Select
              name="category"
              value={formData.category}
              onChange={handleChange}
              label="Danh mục"
              required
            >
              {categories.map((category) => (
                <MenuItem key={category} value={category}>
                  {category}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            name="sourceName"
            label="Tên nguồn"
            fullWidth
            required
            value={formData.sourceName}
            onChange={handleChange}
            margin="normal"
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            name="sourceUrl"
            label="URL nguồn"
            fullWidth
            required
            value={formData.sourceUrl}
            onChange={handleChange}
            margin="normal"
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            name="tags"
            label="Thẻ (phân cách bằng dấu phẩy)"
            fullWidth
            value={formData.tags}
            onChange={handleChange}
            margin="normal"
            placeholder="lúa, gạo, nông sản, ..."
          />
        </Grid>

        <Grid item xs={12}>
          <Divider />
        </Grid>

        <Grid item xs={12}>
          <FormControlLabel
            control={
              <Switch
                name="active"
                checked={formData.active}
                onChange={handleChange}
                color="primary"
              />
            }
            label="Hiển thị tin tức"
          />
        </Grid>

        {error && (
          <Grid item xs={12}>
            <Typography color="error" variant="body2">
              {error}
            </Typography>
          </Grid>
        )}

        <Grid
          item
          xs={12}
          sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}
        >
          <Button onClick={() => onClose()} sx={{ mr: 1 }}>
            Hủy
          </Button>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} /> : null}
          >
            {news ? "Cập nhật" : "Tạo mới"}
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

NewsForm.propTypes = {
  news: PropTypes.object,
  onClose: PropTypes.func.isRequired,
};

export default NewsForm;
