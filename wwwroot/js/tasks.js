$(document).ready(() => {
    RenderTaskList();
})

$('input[name="taskType"]').click((e) => {
    console.log(e.target.checked)
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
                RenderTaskList();

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
                RenderTaskList();

            },
            error: function () {
                alert('Them that bai');
            }
        });
    }
})

function RenderTaskList() {
    $('#taskList').empty();
    $.ajax({
        url: '/Tasks/GetTasks',
        type: 'GET',
        success: function (data) {
            console.log("DATA RESULT:", data)
            var status = {
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
            data.map((item, index) => {
                $('#taskList').append(`
                <tr>
                    <td class="align-middle text-center">${index + 1}</td>
                    <td class="align-middle">${item.name}</td>
                    <td class="align-middle text-center">${item.priority}</td>
                    <td class="align-middle text-center">${item.note}</td>
                    <td class="align-middle text-center ${status[item.status]?.class}">${status[item.status]?.text}</td>
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