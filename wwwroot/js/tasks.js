$(document).ready(() => {
    RenderTaskList();
})

$('input[name="statusType"]').change((e) => {
    var status = e.target.value;
    RenderTaskList(status);
})

$('#addTask').click(function () {
    //lay du lieu tu form
    var taskId = $('#taskId').val();
    var taskName = $('#taskName').val();
    var taskPriority = $('#taskPriority').val();
    var taskStatus = $('#taskStatus').val();
    var taskNote = $('#taskNote').val();

    //xu ly ajax gui du lieu ve controller
    if (taskId == '') {
        $.ajax({
            url: '/Tasks/AddTask',
            type: 'POST',
            data: {
                Name: taskName,
                Priority: taskPriority,
                Status: taskStatus,
                Note: taskNote
            },
            success: function (data) {
                $('#editModal').modal('hide');
                var status = $('input[name="statusType"]:checked').val();
                RenderTaskList(status);

            },
            error: function () {
                alert('Them that bai');
            }
        });
    } else {
        $.ajax({
            url: '/Tasks/EditTask',
            type: 'PUT',
            data: {
                Id: taskId,
                Name: taskName,
                Priority: taskPriority,
                Status: taskStatus,
                Note: taskNote
            },
            success: function (data) {
                $('#editModal').modal('hide');
                var status = $('input[name="statusType"]:checked').val();
                RenderTaskList(status);

            },
            error: function () {
                alert('Them that bai');
            }
        });
    }
})

function RenderTaskList(status = "all") {
    $('#taskList').empty();
    $.ajax({
        url: '/Tasks/GetTasks?status=' + status,
        type: 'GET',
        success: function (data) {
            console.log("DATA RESULT:", data)
            var statusObj = {
                unfinished: {
                    class: "text-danger",
                    text: "Chưa hoàn thành",
                },
                processing: {
                    class: "text-warning",
                    text: "Đang làm",
                },
                completed: {
                    class: "text-primary",
                    text: "Hoàn thành",
                },
            }
            if (!data.length) {
                $('#taskList').append(`
                <tr>
                    <td colspan="7" class="text-center">No data</td>
                </tr>`)
                return;
            }
            data
                .filter(item => {
                    if (status === "all") return true;
                    return item.status === status
                })
                .map((item, index) => {
                $('#taskList').append(`
                <tr>
                    <td class="align-middle text-center">${index + 1}</td>
                    <td class="align-middle">${item.name}</td>
                    <td class="align-middle text-center">${item.priority}</td>
                    <td class="align-middle text-center">${item.note}</td>
                    <td class="align-middle text-center ${statusObj[item.status]?.class}">${statusObj[item.status]?.text}</td>
                    <td class="text-center"><a class="btn btn-primary" href="javascript:EditTask('${item.id}')"><i class='bx bx-edit'></i></a></td>
                    <td class="text-center"><a class="btn btn-danger" href="javascript:DeleteTask('${item.id}')"><i class='bx bx-trash-alt'></i></a></td>
                </tr>`)
            })
        }
    });
 }

function EditTask(id) {
    //xu ly ajax gui du lieu ve controller
    $.ajax({
        url: '/Tasks/GetTaskById/' + id,
        type: 'GET',
        success: function (data) {
            $('#taskId').val(data.id);
            $('#taskName').val(data.name);
            $('#taskPriority').val(data.priority);
            $('#taskStatus').val(data.status);
            $('#taskNote').val(data.note);
            $('#editModalLabel').html('Chỉnh sửa nhiệm vụ');
            $('#addTask').html('Cập nhật');
            $('#editModal').modal('show');
            var status = $('input[name="statusType"]:checked').val();
            RenderTaskList(status);
        },
        error: function () {
            alert('Sua that bai');
        }
    });
}

function DeleteTask(id) {
    //xu ly ajax gui du lieu ve controller
    $.ajax({
        url: '/Tasks/DeleteTask/' + id,
        type: 'DELETE',
        success: function (data) {
            RenderTaskList();
        },
        error: function () {
            alert('Xoa that bai');
        }
    });
}

//lắng nghe sự kiện đóng modal
$('#editModal').on('hidden.bs.modal', function (e) {
    $('#taskId').val('');
    $('#taskName').val('');
    $('#taskPriority').val('');
    //chọn option đầu tiên trong select
    $('#taskStatus').prop('selectedIndex', 0);
    $('#taskNote').val('');
    $('#editModalLabel').html('Thêm nhiệm vụ');
    $('#addTask').html('Thêm mới');
})